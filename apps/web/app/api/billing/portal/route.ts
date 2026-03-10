import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { createBillingPortalSession } from "@/src/server/services/billing-service";

export async function POST() {
  try {
    const { userId } = await requireUserId();
    const session = await createBillingPortalSession(userId);
    return ok({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
