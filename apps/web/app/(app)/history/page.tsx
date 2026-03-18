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
        <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-[#8a857c]">Your Timeline</p>
        <h1 className="text-4xl text-[#121212] [font-family:var(--font-display)]">History</h1>
      </div>
      <Card className="rounded-3xl border-black/10 bg-white/58 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-[#171717]">Subscription history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-black/10 bg-white/68 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#171717]">{row.serviceName}</p>
                <Badge>{row.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-[#6a655d]">
                Billing: {row.billingDate.toLocaleDateString()} {row.costAmount ? `| $${row.costAmount}` : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
