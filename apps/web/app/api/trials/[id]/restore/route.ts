import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { restoreTrial } from "@/src/server/services/trial-service";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUserId();
    const { id } = await context.params;
    const trial = await restoreTrial(id, userId);
    return ok(trial);
  } catch (error) {
    return handleApiError(error);
  }
}
