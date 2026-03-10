import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { reviewDetection } from "@/src/server/services/detection-service";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUserId();
    const { id } = await context.params;
    const result = await reviewDetection(userId, id, "approve");
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
