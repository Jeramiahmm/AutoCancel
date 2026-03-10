import { handleApiError, ok } from "@/src/lib/api";
import { assertCronAuthorized } from "@/src/server/security/cron";
import { prisma } from "@/src/server/db";
import { syncInboxForUser } from "@/src/server/services/detection-service";

export async function POST(request: Request) {
  try {
    assertCronAuthorized(request.headers.get("authorization"));

    const users = await prisma.user.findMany({
      where: {
        emailConnections: {
          some: {
            status: "CONNECTED",
          },
        },
      },
      select: { id: true },
      take: 100,
    });

    const summaries = [];
    for (const user of users) {
      const summary = await syncInboxForUser(user.id);
      summaries.push({ userId: user.id, ...summary });
    }

    return ok({ users: summaries.length, summaries });
  } catch (error) {
    return handleApiError(error);
  }
}
