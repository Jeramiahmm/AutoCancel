import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { prisma } from "@/src/server/db";

export async function GET() {
  try {
    const { userId } = await requireUserId();
    const items = await prisma.trial.findMany({
      where: { userId, status: { in: ["CANCELLED", "COMPLETED"] } },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}
