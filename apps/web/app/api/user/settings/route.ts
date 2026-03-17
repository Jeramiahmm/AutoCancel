import { z } from "zod";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { prisma } from "@/src/server/db";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  timezone: z.string().trim().min(2).max(120).optional(),
});

export async function GET() {
  try {
    const { userId } = await requireUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        tier: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await requireUserId();
    const body = await request.json();
    const input = inputSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.timezone ? { timezone: input.timezone } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        timezone: true,
        tier: true,
      },
    });

    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
