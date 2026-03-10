import { prisma } from "@/src/server/db";
import { connectGoogle } from "@/src/server/integrations/google";
import { connectMicrosoft } from "@/src/server/integrations/microsoft";
import { upsertConnection } from "@/src/server/integrations/oauth";
import { syncInboxForUser } from "@/src/server/services/detection-service";
import { DEMO_EMAIL } from "@/src/server/services/demo-service";
import type { ProviderType } from "@prisma/client";

type ConnectInput = {
  userId: string;
  code: string;
  redirectUri: string;
};

export async function connectProvider(provider: "GOOGLE" | "MICROSOFT", input: ConnectInput) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { isDemo: true },
  });

  if (user?.isDemo) {
    return upsertConnection({
      userId: input.userId,
      provider,
      emailAddress: DEMO_EMAIL,
      accessToken: "demo-token",
      refreshToken: "demo-refresh",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      scopes: provider === "GOOGLE" ? ["gmail.readonly"] : ["mail.read"],
    });
  }

  const oauthData =
    provider === "GOOGLE"
      ? await connectGoogle(input.code, input.redirectUri)
      : await connectMicrosoft(input.code, input.redirectUri);

  return upsertConnection({
    userId: input.userId,
    provider,
    emailAddress: oauthData.emailAddress,
    accessToken: oauthData.accessToken,
    refreshToken: oauthData.refreshToken,
    expiresAt: oauthData.expiresAt,
    scopes: oauthData.scopes,
  });
}

export async function connectImapProvider(input: {
  userId: string;
  email: string;
  host: string;
  port: number;
  secure: boolean;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { isDemo: true },
  });

  if (user?.isDemo) {
    return upsertConnection({
      userId: input.userId,
      provider: "IMAP",
      emailAddress: DEMO_EMAIL,
      accessToken: "demo-imap-token",
      refreshToken: "demo-imap-refresh",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      scopes: ["imap.oauth2"],
      host: "imap.demo.autocancel.app",
      port: 993,
      secure: true,
    });
  }

  return upsertConnection({
    userId: input.userId,
    provider: "IMAP",
    emailAddress: input.email,
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    expiresAt: input.expiresAt,
    scopes: ["imap.oauth2"],
    host: input.host,
    port: input.port,
    secure: input.secure,
  });
}

export async function disconnectProvider(userId: string, provider: ProviderType) {
  await prisma.emailConnection.updateMany({
    where: { userId, provider },
    data: { status: "DISCONNECTED" },
  });
}

export async function syncProvider(userId: string, provider: ProviderType) {
  return syncInboxForUser(userId, provider);
}

export async function listConnections(userId: string) {
  return prisma.emailConnection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function connectDemoProvider(userId: string, provider: ProviderType) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isDemo: true } });
  if (!user?.isDemo) {
    throw new Error("Demo-only endpoint");
  }

  if (provider === "IMAP") {
    return connectImapProvider({
      userId,
      email: DEMO_EMAIL,
      host: "imap.demo.autocancel.app",
      port: 993,
      secure: true,
      accessToken: "demo-imap-token",
      refreshToken: "demo-imap-refresh",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }

  return connectProvider(provider as "GOOGLE" | "MICROSOFT", {
    userId,
    code: "demo-code",
    redirectUri: "demo://redirect",
  });
}
