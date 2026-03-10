import { subDays } from "date-fns";
import { env, hasGoogleOAuth } from "@/src/lib/env";
import { decrypt } from "@/src/server/security/encryption";
import type { InboxMessage } from "@/src/server/integrations/types";
import type { EmailConnection } from "@prisma/client";

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export async function exchangeGoogleCode(code: string, redirectUri: string) {
  if (!hasGoogleOAuth()) {
    throw new Error("Google OAuth is not configured");
  }

  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID as string,
    client_secret: env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status}`);
  }

  return (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type: string;
    id_token?: string;
  };
}

async function getGoogleProfile(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    return null;
  }

  const profile = (await res.json()) as { email?: string };
  return profile.email;
}

export async function connectGoogle(code: string, redirectUri: string) {
  const tokenData = await exchangeGoogleCode(code, redirectUri);
  const emailAddress = await getGoogleProfile(tokenData.access_token);

  return {
    emailAddress,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : undefined,
    scopes: tokenData.scope?.split(" ") ?? ["https://www.googleapis.com/auth/gmail.readonly"],
  };
}

export async function fetchGoogleTrialEmails(
  connection: EmailConnection,
  since = subDays(new Date(), 180),
): Promise<InboxMessage[]> {
  const token = decrypt(connection.encryptedAccessToken);
  const afterEpoch = Math.floor(since.getTime() / 1000);
  const q = encodeURIComponent(
    `after:${afterEpoch} ("free trial" OR "trial period" OR subscription OR "billing begins" OR renewal)`,
  );

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25&q=${q}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!listRes.ok) {
    throw new Error(`Failed to list Gmail messages: ${listRes.status}`);
  }

  const listData = (await listRes.json()) as {
    messages?: Array<{ id: string; threadId?: string }>;
  };

  const messages = listData.messages ?? [];

  const detailed = await Promise.all(
    messages.map(async ({ id, threadId }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );

      if (!msgRes.ok) {
        return null;
      }

      const payload = (await msgRes.json()) as {
        id: string;
        snippet?: string;
        internalDate?: string;
        payload?: {
          headers?: Array<{ name: string; value: string }>;
        };
      };

      const headers = payload.payload?.headers ?? [];
      const from = headers.find((h) => h.name.toLowerCase() === "from")?.value ?? "unknown sender";
      const subject =
        headers.find((h) => h.name.toLowerCase() === "subject")?.value ?? "Trial notification";

      return {
        provider: "GOOGLE" as const,
        messageId: payload.id,
        threadId,
        from,
        subject,
        body: payload.snippet ?? "",
        snippet: payload.snippet,
        internalDate: payload.internalDate ? new Date(Number(payload.internalDate)) : undefined,
      };
    }),
  );

  return detailed.filter(Boolean) as InboxMessage[];
}
