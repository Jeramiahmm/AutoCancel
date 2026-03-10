"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TrialCard } from "@autocancel/shared";
import { Bell, CalendarClock, RefreshCw, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Connection = {
  id: string;
  provider: "GOOGLE" | "MICROSOFT" | "IMAP";
  status: string;
  emailAddress: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadgeVariant(status: string): "default" | "success" | "warning" | "danger" {
  if (status === "BILLING_SOON") {
    return "warning";
  }

  if (status === "CANCELLED" || status === "COMPLETED") {
    return "default";
  }

  return "success";
}

function base64ToUint8Array(base64: string) {
  const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const raw = window.atob(normalized + pad);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export function DashboardClient({
  initialTrials,
  billingSoon,
  cancelled,
  completed,
  pendingReviewCount,
  tier,
  isDemo,
  connections,
}: {
  initialTrials: TrialCard[];
  billingSoon: TrialCard[];
  cancelled: TrialCard[];
  completed: TrialCard[];
  pendingReviewCount: number;
  tier: "FREE" | "PREMIUM";
  isDemo: boolean;
  connections: Connection[];
}) {
  const [trials, setTrials] = useState(initialTrials);
  const [pending, setPending] = useState<string | null>(null);
  const [mobileLinkToken, setMobileLinkToken] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [imapForm, setImapForm] = useState({ email: "", host: "", port: "993", accessToken: "" });

  const activeCount = useMemo(
    () => trials.filter((trial) => trial.status === "ACTIVE" || trial.status === "BILLING_SOON").length,
    [trials],
  );

  async function syncAll() {
    setPending("sync");
    await fetch("/api/integrations", { method: "POST" });
    setPending(null);
    setNotice(isDemo ? "Demo sync complete: added a new review-queue item." : "Inbox sync complete.");
    window.location.reload();
  }

  async function markCancelled(id: string) {
    setPending(id);
    await fetch(`/api/trials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setTrials((prev) => prev.map((trial) => (trial.id === id ? { ...trial, status: "CANCELLED" } : trial)));
    setPending(null);
  }

  async function connectImap() {
    setPending("imap");
    await fetch("/api/integrations/imap/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: imapForm.email,
        host: imapForm.host,
        port: Number(imapForm.port),
        secure: true,
        accessToken: imapForm.accessToken,
      }),
    });
    setPending(null);
    window.location.reload();
  }

  async function connectDemoProvider(provider: "GOOGLE" | "MICROSOFT" | "IMAP") {
    setPending(`demo-${provider}`);
    await fetch("/api/demo/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    setPending(null);
    setNotice(`${provider} demo connection enabled.`);
    window.location.reload();
  }

  async function subscribeWebPush() {
    if (isDemo) {
      setNotice("Demo mode: web push subscription is simulated.");
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    const registration = await navigator.serviceWorker.register("/service-worker.js");

    const keyResponse = await fetch("/api/public/vapid-key");
    const keyData = await keyResponse.json();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(keyData.publicKey),
    });

    await fetch("/api/notifications/subscribe/web-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setNotice("Web push enabled.");
  }

  async function upgrade() {
    if (isDemo) {
      const response = await fetch("/api/demo/toggle-tier", { method: "POST" });
      const data = await response.json();
      setNotice(`Demo plan switched to ${data?.data?.tier ?? "PREMIUM"}.`);
      window.location.reload();
      return;
    }

    const response = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await response.json();
    if (data?.data?.url) {
      window.location.href = data.data.url;
    }
  }

  async function openBillingPortal() {
    if (isDemo) {
      const response = await fetch("/api/demo/toggle-tier", { method: "POST" });
      const data = await response.json();
      setNotice(`Demo plan switched to ${data?.data?.tier ?? "FREE"}.`);
      window.location.reload();
      return;
    }

    const response = await fetch("/api/billing/portal", { method: "POST" });
    const data = await response.json();
    if (data?.data?.url) {
      window.location.href = data.data.url;
    }
  }

  async function generateMobileLinkToken() {
    const response = await fetch("/api/mobile/link-token", { method: "POST" });
    const data = await response.json();
    setMobileLinkToken(data?.data?.token ?? "");
  }

  async function resetDemoData() {
    setPending("reset-demo");
    await fetch("/api/demo/reset", { method: "POST" });
    setPending(null);
    setNotice("Demo data reset to the original seeded state.");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">{notice}</div>
      ) : null}

      {isDemo ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetDemoData} disabled={pending === "reset-demo"}>
            {pending === "reset-demo" ? "Resetting..." : "Reset demo data"}
          </Button>
          <Button variant="outline" onClick={syncAll} disabled={pending === "sync"}>
            Simulate inbox sync
          </Button>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Active trials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold metric-gradient">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Billing soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold metric-gradient">{billingSoon.length}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Needs review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold metric-gradient">{pendingReviewCount}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">{tier === "PREMIUM" ? "Premium" : "Free"}</p>
            {tier === "FREE" ? (
              <Button size="sm" onClick={upgrade}>
                {isDemo ? "Unlock Premium (Demo)" : "Upgrade to Premium"}
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={openBillingPortal}>
                {isDemo ? "Switch to Free (Demo)" : "Manage billing"}
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <Card className="glass">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Active Trials</CardTitle>
              <p className="text-sm text-muted-foreground">Track upcoming charges and cancel in time.</p>
            </div>
            <Button variant="outline" onClick={syncAll} disabled={pending === "sync"}>
              <RefreshCw className="mr-2 size-4" />
              {pending === "sync" ? "Syncing..." : "Sync inbox"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {trials
              .filter((trial) => trial.status === "ACTIVE" || trial.status === "BILLING_SOON")
              .map((trial) => (
                <div key={trial.id} className="rounded-xl border border-white/60 bg-white/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{trial.serviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        Started {formatDate(trial.startDate)} | Bills {formatDate(trial.billingDate)}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(trial.status)}>{trial.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{trial.daysRemaining} days remaining</p>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => markCancelled(trial.id)}
                      disabled={pending === trial.id}
                    >
                      Cancelled
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" />
                Connect providers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isDemo ? (
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => connectDemoProvider("GOOGLE")}
                    disabled={pending === "demo-GOOGLE"}
                  >
                    Simulate Gmail connection
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => connectDemoProvider("MICROSOFT")}
                    disabled={pending === "demo-MICROSOFT"}
                  >
                    Simulate Outlook connection
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => connectDemoProvider("IMAP")}
                    disabled={pending === "demo-IMAP"}
                  >
                    Simulate IMAP connection
                  </Button>
                </div>
              ) : (
                <>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/oauth/google">Connect Gmail</Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/oauth/microsoft">Connect Outlook</Link>
                  </Button>
                  <div className="rounded-xl border p-3">
                    <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">OAuth2 IMAP fallback</p>
                    <div className="space-y-2">
                      <Input
                        value={imapForm.email}
                        onChange={(event) => setImapForm((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="email"
                      />
                      <Input
                        value={imapForm.host}
                        onChange={(event) => setImapForm((prev) => ({ ...prev, host: event.target.value }))}
                        placeholder="imap host"
                      />
                      <Input
                        value={imapForm.port}
                        onChange={(event) => setImapForm((prev) => ({ ...prev, port: event.target.value }))}
                        placeholder="993"
                      />
                      <Input
                        value={imapForm.accessToken}
                        onChange={(event) => setImapForm((prev) => ({ ...prev, accessToken: event.target.value }))}
                        placeholder="OAuth access token"
                      />
                      <Button className="w-full" size="sm" onClick={connectImap} disabled={pending === "imap"}>
                        Connect IMAP
                      </Button>
                    </div>
                  </div>
                </>
              )}
              <p className="text-xs text-muted-foreground">{connections.length} provider connection(s) active</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Reminder channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={subscribeWebPush}>
                <Bell className="mr-2 size-4" />
                Enable web push
              </Button>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="rounded-lg border border-white/60 p-2">
                  <CalendarClock className="mb-1 size-4" />
                  48h alert
                </div>
                <div className="rounded-lg border border-white/60 p-2">
                  <Zap className="mb-1 size-4" />
                  24h alert
                </div>
                <div className="rounded-lg border border-white/60 p-2">
                  <Shield className="mb-1 size-4" />
                  OAuth only
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start" onClick={generateMobileLinkToken}>
                Generate mobile link token
              </Button>
              {mobileLinkToken ? <Input readOnly value={mobileLinkToken} className="text-xs" /> : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Cancelled trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {cancelled.length ? (
              cancelled.slice(0, 5).map((trial) => (
                <div key={trial.id} className="rounded-lg border border-white/60 px-3 py-2">
                  {trial.serviceName}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No cancelled trials yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Completed subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {completed.length ? (
              completed.slice(0, 5).map((trial) => (
                <div key={trial.id} className="rounded-lg border border-white/60 px-3 py-2">
                  {trial.serviceName}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No completed subscriptions yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
