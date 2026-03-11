import { WebPushSubscriptionInputSchema } from "@/src/shared/contracts";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { prisma } from "@/src/server/db";

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserId();
    const body = await request.json();
    const input = WebPushSubscriptionInputSchema.parse(body);

    const saved = await prisma.notificationEndpoint.upsert({
      where: {
        userId_channel_endpoint: {
          userId,
          channel: "WEB_PUSH",
          endpoint: input.endpoint,
        },
      },
      update: {
        auth: input.keys.auth,
        p256dh: input.keys.p256dh,
      },
      create: {
        userId,
        channel: "WEB_PUSH",
        endpoint: input.endpoint,
        auth: input.keys.auth,
        p256dh: input.keys.p256dh,
      },
    });

    return ok(saved, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
