import { ImapConnectInputSchema } from "@/src/shared/contracts";
import { handleApiError, ok } from "@/src/lib/api";
import { requireUserId } from "@/src/lib/require-user";
import { connectImapProvider } from "@/src/server/services/integration-service";

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserId();
    const body = await request.json();
    const input = ImapConnectInputSchema.parse(body);

    const connection = await connectImapProvider({
      userId,
      email: input.email,
      host: input.host,
      port: input.port,
      secure: input.secure,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      expiresAt: input.expiresAt,
    });

    return ok(connection, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
