import type { ProviderType } from "@prisma/client";

export type InboxMessage = {
  provider: ProviderType;
  messageId: string;
  threadId?: string | null;
  from: string;
  subject: string;
  body: string;
  snippet?: string;
  internalDate?: Date;
};
