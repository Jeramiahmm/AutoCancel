import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { listConnections } from "@/src/server/services/integration-service";
import { syncInboxForUser } from "@/src/server/services/detection-service";

export async function GET() {
  try {
    const { userId } = await requireUserId();
    const connections = await listConnections(userId);
    return ok(connections);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    const { userId } = await requireUserId();
    const summary = await syncInboxForUser(userId);
    return ok(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
