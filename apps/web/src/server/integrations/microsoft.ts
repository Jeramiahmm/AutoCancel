import { subDays } from "date-fns";
import { env, hasMicrosoftOAuth } from "@/src/lib/env";
import { decrypt } from "@/src/server/security/encryption";
import { isLikelyTrialEmail } from "@/src/server/services/keyword-detector";
import type { InboxMessage } from "@/src/server/integrations/types";
import type { EmailConnection } from "@prisma/client";

const MS_TOKEN_ENDPOINT = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

export async function exchangeMicrosoftCode(code: string, redirectUri: string) {
  if (!hasMicrosoftOAuth()) {
    throw new Error("Microsoft OAuth is not configured");
  }

  const params = new URLSearchParams({
    client_id: env.MICROSOFT_CLIENT_ID as string,
    client_secret: env.MICROSOFT_CLIENT_SECRET as string,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    scope: "offline_access User.Read Mail.Read",
  });

  const res = await fetch(MS_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    throw new Error(`Microsoft token exchange failed: ${res.status}`);
  }

  return (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };
}

async function getMicrosoftProfile(accessToken: string) {
  const res = await fetch("https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return null;
  }

  const profile = (await res.json()) as { mail?: string; userPrincipalName?: string };
  return profile.mail ?? profile.userPrincipalName ?? null;
}

export async function connectMicrosoft(code: string, redirectUri: string) {
  const tokenData = await exchangeMicrosoftCode(code, redirectUri);
  const emailAddress = await getMicrosoftProfile(tokenData.access_token);

  return {
    emailAddress: emailAddress ?? undefined,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : undefined,
    scopes: tokenData.scope?.split(" ") ?? ["Mail.Read", "offline_access"],
  };
}

export async function fetchMicrosoftTrialEmails(
  connection: EmailConnection,
  since = subDays(new Date(), 180),
): Promise<InboxMessage[]> {
  const token = decrypt(connection.encryptedAccessToken);
  const isoSince = since.toISOString();

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages?$top=40&$select=id,conversationId,subject,from,bodyPreview,receivedDateTime&$filter=receivedDateTime ge ${isoSince}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to list Microsoft messages: ${res.status}`);
  }

  const data = (await res.json()) as {
    value?: Array<{
      id: string;
      conversationId?: string;
      subject?: string;
      from?: { emailAddress?: { address?: string } };
      bodyPreview?: string;
      receivedDateTime?: string;
    }>;
  };

  return (data.value ?? [])
    .map((item) => {
      const subject = item.subject ?? "Trial notification";
      const body = item.bodyPreview ?? "";
      const from = item.from?.emailAddress?.address ?? "unknown sender";

      if (!isLikelyTrialEmail(subject, body)) {
        return null;
      }

      return {
        provider: "MICROSOFT" as const,
        messageId: item.id,
        threadId: item.conversationId,
        subject,
        body,
        snippet: body,
        from,
        internalDate: item.receivedDateTime ? new Date(item.receivedDateTime) : undefined,
      };
    })
    .filter(Boolean) as InboxMessage[];
}
