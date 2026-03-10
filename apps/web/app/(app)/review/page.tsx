import { requireAuth } from "@/src/lib/auth-guard";
import { listPendingDetections } from "@/src/server/services/detection-service";
import { ReviewQueue } from "@/components/dashboard/review-queue";

export default async function ReviewPage() {
  const session = await requireAuth();
  const detections = await listPendingDetections(session.user.id);

  return <ReviewQueue detections={detections} />;
}
