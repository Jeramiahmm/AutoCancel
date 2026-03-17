import { requireAuth } from "@/src/lib/auth-guard";
import { listConnections } from "@/src/server/services/integration-service";
import { prisma } from "@/src/server/db";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default async function SettingsPage() {
  const session = await requireAuth();

  const [user, connections] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        timezone: true,
      },
    }),
    listConnections(session.user.id),
  ]);

  return (
    <SettingsPanel
      name={user?.name ?? ""}
      email={user?.email ?? session.user.email ?? ""}
      timezone={user?.timezone ?? "America/Denver"}
      connections={connections.map((connection) => ({
        id: connection.id,
        provider: connection.provider,
        status: connection.status,
        emailAddress: connection.emailAddress,
        createdAt: connection.createdAt.toISOString(),
      }))}
    />
  );
}
