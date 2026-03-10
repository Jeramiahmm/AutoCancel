import { z } from "zod";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { connectDemoProvider } from "@/src/server/services/integration-service";

const inputSchema = z.object({
  provider: z.enum(["GOOGLE", "MICROSOFT", "IMAP"]),
});

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserId();
    const body = await request.json();
    const input = inputSchema.parse(body);

    const connection = await connectDemoProvider(userId, input.provider);
    return ok(connection);
  } catch (error) {
    return handleApiError(error);
  }
}
