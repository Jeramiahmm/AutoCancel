import { IntegrationConnectInputSchema } from "@/src/shared/contracts";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { connectProvider } from "@/src/server/services/integration-service";

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserId();
    const body = await request.json();
    const input = IntegrationConnectInputSchema.parse(body);

    const connection = await connectProvider("MICROSOFT", {
      userId,
      code: input.code,
      redirectUri: input.redirectUri,
    });

    return ok(connection, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
