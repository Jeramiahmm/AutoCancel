import { TrialPatchInputSchema } from "@/src/shared/contracts";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { updateTrial } from "@/src/server/services/trial-service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireUserId();
    const { id } = await context.params;
    const body = await request.json();
    const input = TrialPatchInputSchema.parse(body);
    const trial = await updateTrial(id, userId, input);
    return ok(trial);
  } catch (error) {
    return handleApiError(error);
  }
}
