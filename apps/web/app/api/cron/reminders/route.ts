import { handleApiError, ok } from "@/src/lib/api";
import { processDueReminders } from "@/src/server/services/reminder-service";
import { assertCronAuthorized } from "@/src/server/security/cron";

export async function POST(request: Request) {
  try {
    assertCronAuthorized(request.headers.get("authorization"));
    const processed = await processDueReminders();
    return ok({ processed });
  } catch (error) {
    return handleApiError(error);
  }
}
