import { requireAuth } from "@/src/lib/auth-guard";
import { listPendingDetections } from "@/src/server/services/detection-service";
import { ReviewQueue } from "@/components/dashboard/review-queue";

export default async function ReviewPage() {
  const session = await requireAuth();
  const detections = await listPendingDetections(session.user.id);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-zinc-500">Quality Control</p>
        <h1 className="text-4xl font-bold text-white">Review Queue</h1>
      </div>
      <ReviewQueue detections={detections} />
    </div>
  );
}
