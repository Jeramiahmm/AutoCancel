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
    <Card className="glass">
      <CardHeader>
        <CardTitle>Subscription history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-white/60 bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{row.serviceName}</p>
              <Badge>{row.status.replace("_", " ")}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Billing: {row.billingDate.toLocaleDateString()} {row.costAmount ? `| $${row.costAmount}` : ""}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
