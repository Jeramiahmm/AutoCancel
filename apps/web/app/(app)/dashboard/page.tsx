import { requireAuth } from "@/src/lib/auth-guard";
import { getAuthErrorMessage } from "@/src/lib/auth-errors";
import { listConnections } from "@/src/server/services/integration-service";
import { listPendingDetections } from "@/src/server/services/detection-service";
import { listTrials } from "@/src/server/services/trial-service";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ connect_error?: string; connected?: string }>;
}) {
  const session = await requireAuth();
  const params = await searchParams;
  const initialNotice = params.connect_error
    ? getAuthErrorMessage(params.connect_error) ?? `Connection failed: ${params.connect_error}`
    : params.connected
      ? `${params.connected} connected successfully.`
      : "";

  const [active, billingSoon, cancelled, completed, pending, connections] = await Promise.all([
    listTrials(session.user.id, "active"),
    listTrials(session.user.id, "billing-soon"),
    listTrials(session.user.id, "cancelled"),
    listTrials(session.user.id, "completed"),
    listPendingDetections(session.user.id),
    listConnections(session.user.id),
  ]);

  const mergedMap = new Map<string, (typeof active)[number]>();
  for (const trial of [...active, ...billingSoon]) {
    mergedMap.set(trial.id, trial);
  }
  const mergedActive = Array.from(mergedMap.values());

  return (
    <DashboardClient
      initialTrials={mergedActive}
      billingSoon={billingSoon}
      cancelled={cancelled}
      completed={completed}
      pendingReviewCount={pending.length}
      tier={(session.user.tier ?? "FREE") as "FREE" | "PREMIUM"}
      initialNotice={initialNotice}
      connections={connections.map((conn) => ({
        id: conn.id,
        provider: conn.provider,
        status: conn.status,
        emailAddress: conn.emailAddress,
      }))}
    />
  );
}
