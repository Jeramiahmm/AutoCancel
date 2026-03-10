import { MobilePushTokenInputSchema } from "@autocancel/shared";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { prisma } from "@/src/server/db";
import { verifyMobileLinkToken } from "@/src/server/security/mobile-link";

async function resolveUserId(request: Request) {
  try {
    const sessionUser = await requireUserId();
    return sessionUser.userId;
  } catch {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");
    return verifyMobileLinkToken(token);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const body = await request.json();
    const input = MobilePushTokenInputSchema.parse(body);

    const saved = await prisma.notificationEndpoint.upsert({
      where: {
        userId_channel_endpoint: {
          userId,
          channel: "MOBILE_PUSH",
          endpoint: input.token,
        },
      },
      update: {
        mobilePlatform: input.platform,
        deviceLabel: input.deviceLabel,
      },
      create: {
        userId,
        channel: "MOBILE_PUSH",
        endpoint: input.token,
        mobilePlatform: input.platform,
        deviceLabel: input.deviceLabel,
      },
    });

    return ok(saved, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
