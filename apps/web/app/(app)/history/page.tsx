import { requireAuth } from "@/src/lib/auth-guard";
import { prisma } from "@/src/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function HistoryPage() {
  const session = await requireAuth();

  const rows = await prisma.trial.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["CANCELLED", "COMPLETED", "ACTIVE", "BILLING_SOON"] },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-zinc-500">Your Timeline</p>
        <h1 className="text-4xl font-bold text-white">History</h1>
      </div>
      <Card className="rounded-3xl border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Subscription history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{row.serviceName}</p>
                <Badge>{row.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Billing: {row.billingDate.toLocaleDateString()} {row.costAmount ? `| $${row.costAmount}` : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
