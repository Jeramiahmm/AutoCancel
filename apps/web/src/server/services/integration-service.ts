import { prisma } from "@/src/server/db";
import { connectGoogle } from "@/src/server/integrations/google";
import { connectMicrosoft } from "@/src/server/integrations/microsoft";
import { upsertConnection } from "@/src/server/integrations/oauth";
import { syncInboxForUser } from "@/src/server/services/detection-service";
import type { ProviderType } from "@prisma/client";

type ConnectInput = {
  userId: string;
  code: string;
  redirectUri: string;
};

export async function connectProvider(provider: "GOOGLE" | "MICROSOFT", input: ConnectInput) {
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
