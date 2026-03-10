import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { syncProvider } from "@/src/server/services/integration-service";

export async function POST() {
  try {
    const { userId } = await requireUserId();
    const summary = await syncProvider(userId, "GOOGLE");
    return ok(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
