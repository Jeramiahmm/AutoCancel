import { env } from "@/src/lib/env";

export function assertCronAuthorized(headerValue: string | null) {
  if (!headerValue || headerValue !== `Bearer ${env.CRON_SECRET}`) {
    throw new Error("Unauthorized cron request");
  }
}
