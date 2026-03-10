import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { listTrials } from "@/src/server/services/trial-service";

export async function GET(request: Request) {
  try {
    const { userId } = await requireUserId();
    const status = new URL(request.url).searchParams.get("status") ?? undefined;
    const trials = await listTrials(userId, status);
    return ok(trials);
  } catch (error) {
    return handleApiError(error);
  }
}
