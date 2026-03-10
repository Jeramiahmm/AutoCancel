import { handleApiError, ok } from "@/src/lib/api";
import { handleStripeWebhook } from "@/src/server/services/billing-service";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    const payload = await request.text();
    const eventId = await handleStripeWebhook(payload, signature);
    return ok({ eventId });
  } catch (error) {
    return handleApiError(error);
  }
}
