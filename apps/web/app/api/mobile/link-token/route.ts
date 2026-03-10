import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { createMobileLinkToken } from "@/src/server/security/mobile-link";

export async function POST() {
  try {
    const { userId } = await requireUserId();
    const token = await createMobileLinkToken(userId);
    return ok({ token, expiresInMinutes: 15 });
  } catch (error) {
    return handleApiError(error);
  }
}
