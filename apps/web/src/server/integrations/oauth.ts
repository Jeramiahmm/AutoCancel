import { encrypt } from "@/src/server/security/encryption";
import { prisma } from "@/src/server/db";
import type { ProviderType } from "@prisma/client";

export async function upsertConnection(params: {
  userId: string;
  provider: ProviderType;
  emailAddress?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
  host?: string;
  port?: number;
  secure?: boolean;
}) {
  const {
    userId,
    provider,
    emailAddress,
    accessToken,
    refreshToken,
    expiresAt,
    scopes,
    host,
    port,
    secure,
  } = params;

  const existing = await prisma.emailConnection.findFirst({
    where: {
      userId,
      provider,
    },
  });

  if (existing) {
    return prisma.emailConnection.update({
      where: { id: existing.id },
      data: {
        emailAddress,
        encryptedAccessToken: encrypt(accessToken),
        encryptedRefreshToken: refreshToken ? encrypt(refreshToken) : null,
        expiresAt,
        scopes,
        status: "CONNECTED",
        host,
        port,
        secure,
      },
    });
  }

  return prisma.emailConnection.create({
    data: {
      userId,
      provider,
      emailAddress,
      encryptedAccessToken: encrypt(accessToken),
      encryptedRefreshToken: refreshToken ? encrypt(refreshToken) : null,
      expiresAt,
      scopes,
      host,
      port,
      secure,
      status: "CONNECTED",
    },
  });
}
