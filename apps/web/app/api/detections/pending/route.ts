import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { listPendingDetections } from "@/src/server/services/detection-service";

export async function GET() {
  try {
    const { userId } = await requireUserId();
    const detections = await listPendingDetections(userId);
    return ok(detections);
  } catch (error) {
    return handleApiError(error);
  }
}
