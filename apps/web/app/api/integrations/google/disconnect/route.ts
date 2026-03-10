import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { disconnectProvider } from "@/src/server/services/integration-service";

export async function POST() {
  try {
    const { userId } = await requireUserId();
    await disconnectProvider(userId, "GOOGLE");
    return ok({ disconnected: true });
  } catch (error) {
    return handleApiError(error);
  }
}
