import { ImapFlow } from "imapflow";
import { subDays } from "date-fns";
import { decrypt } from "@/src/server/security/encryption";
import { isLikelyTrialEmail } from "@/src/server/services/keyword-detector";
import type { EmailConnection } from "@prisma/client";
import type { InboxMessage } from "@/src/server/integrations/types";

function sanitizeSource(source?: Buffer | null) {
  return (source?.toString("utf8") ?? "").slice(0, 5000);
}

export async function fetchImapTrialEmails(
  connection: EmailConnection,
  since = subDays(new Date(), 180),
): Promise<InboxMessage[]> {
  if (!connection.host || !connection.port || !connection.emailAddress) {
    return [];
  }

  const accessToken = decrypt(connection.encryptedAccessToken);
  const client = new ImapFlow({
    host: connection.host,
    port: connection.port,
    secure: connection.secure ?? true,
    auth: {
      user: connection.emailAddress,
      accessToken,
      loginMethod: "AUTH=XOAUTH2",
    },
  });

  await client.connect();

  try {
    await client.mailboxOpen("INBOX");
    const ids = await client.search({ since });
    const messageIds = ids === false ? [] : ids;

    const results: InboxMessage[] = [];

    for await (const message of client.fetch(messageIds.slice(-50), {
      uid: true,
      envelope: true,
      source: true,
      internalDate: true,
    })) {
      const subject = message.envelope?.subject ?? "Trial notification";
      const body = sanitizeSource(message.source);
      const from =
        message.envelope?.from?.[0]?.address ||
        `${message.envelope?.from?.[0]?.name ?? "unknown"}@unknown`;

      if (!isLikelyTrialEmail(subject, body)) {
        continue;
      }

      results.push({
        provider: "IMAP",
        messageId: String(message.uid),
        threadId: null,
        from,
        subject,
        body,
        snippet: body.slice(0, 220),
        internalDate:
          message.internalDate instanceof Date
            ? message.internalDate
            : message.internalDate
              ? new Date(message.internalDate)
              : undefined,
      });
    }

    return results;
  } finally {
    await client.logout();
  }
}
