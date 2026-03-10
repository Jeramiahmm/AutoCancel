import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { createCheckoutSession } from "@/src/server/services/billing-service";

export async function POST() {
  try {
    const { userId, email } = await requireUserId();
    const session = await createCheckoutSession(userId, email);
    return ok({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
