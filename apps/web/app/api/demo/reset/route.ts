import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { resetDemoData } from "@/src/server/services/demo-service";

export async function POST() {
  try {
    const { userId } = await requireUserId();
    const result = await resetDemoData(userId);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
