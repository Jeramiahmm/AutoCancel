"use client";

import { useMemo, useState } from "react";
import type { TrialCard } from "@/src/shared/contracts";
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

async function parseApiResponse(response: Response) {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as { success?: boolean; data?: unknown };
}

export function DashboardClient({
  initialTrials,
  billingSoon,
  cancelled,
  completed,
  pendingReviewCount,
  tier,
  initialNotice,
  connections,
}: {
  initialTrials: TrialCard[];
  billingSoon: TrialCard[];
  cancelled: TrialCard[];
  completed: TrialCard[];
  pendingReviewCount: number;
  tier: "FREE" | "PREMIUM";
  initialNotice?: string;
  connections: Connection[];
}) {
  const [trials, setTrials] = useState(initialTrials);
  const [pending, setPending] = useState<string | null>(null);
  const [mobileLinkToken, setMobileLinkToken] = useState<string>("");
  const [notice, setNotice] = useState<string>(initialNotice ?? "");
  const [imapForm, setImapForm] = useState({ email: "", host: "", port: "993", accessToken: "" });

  const activeCount = useMemo(
    () => trials.filter((trial) => trial.status === "ACTIVE" || trial.status === "BILLING_SOON").length,
    [trials],
  );

  function startOAuthConnect(provider: "google" | "microsoft") {
    setPending(`oauth-${provider}`);
    setNotice("");
    window.location.href = `/oauth/${provider}`;
  }

  async function syncAll() {
    setPending("sync");
    setNotice("");
    try {
      await parseApiResponse(await fetch("/api/integrations", { method: "POST" }));
      setNotice("Inbox sync complete.");
      window.location.reload();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to sync inbox right now.");
    } finally {
      setPending(null);
    }
  }

  async function markCancelled(id: string) {
    setPending(id);
    setNotice("");
    try {
      await parseApiResponse(
        await fetch(`/api/trials/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELLED" }),
        }),
      );
      setTrials((prev) => prev.map((trial) => (trial.id === id ? { ...trial, status: "CANCELLED" } : trial)));
      setNotice("Trial marked as cancelled.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update trial.");
    } finally {
      setPending(null);
    }
  }

  async function connectImap() {
    if (!imapForm.email || !imapForm.host || !imapForm.accessToken) {
      setNotice("Email, IMAP host, and OAuth access token are required.");
      return;
    }

    setPending("imap");
    setNotice("");
    try {
      await parseApiResponse(
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
        }),
      );
      setNotice("IMAP connection saved.");
      window.location.reload();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to connect IMAP provider.");
    } finally {
      setPending(null);
    }
  }

  async function subscribeWebPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setNotice("Web push is not supported in this browser.");
      return;
    }
    setPending("web-push");
    setNotice("");
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js");

      const keyData = await parseApiResponse(await fetch("/api/public/vapid-key"));
      const publicKey =
        typeof keyData?.data === "object" &&
        keyData.data &&
        "publicKey" in keyData.data &&
        typeof keyData.data.publicKey === "string"
          ? keyData.data.publicKey
          : "";
      if (!publicKey) {
        throw new Error("Missing VAPID public key.");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(publicKey),
      });

      await parseApiResponse(
        await fetch("/api/notifications/subscribe/web-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        }),
      );
      setNotice("Web push enabled.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to enable web push.");
    } finally {
      setPending(null);
    }
  }

  async function upgrade() {
    setPending("upgrade");
    setNotice("");
    try {
      const data = await parseApiResponse(await fetch("/api/billing/checkout", { method: "POST" }));
      const url = typeof data?.data === "object" && data.data && "url" in data.data ? String(data.data.url) : "";
      if (!url) {
        throw new Error("Checkout URL not returned.");
      }
      window.location.href = url;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to start checkout.");
      setPending(null);
    }
  }

  async function openBillingPortal() {
    setPending("billing-portal");
    setNotice("");
    try {
      const data = await parseApiResponse(await fetch("/api/billing/portal", { method: "POST" }));
      const url = typeof data?.data === "object" && data.data && "url" in data.data ? String(data.data.url) : "";
      if (!url) {
        throw new Error("Billing portal URL not returned.");
      }
      window.location.href = url;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to open billing portal.");
      setPending(null);
    }
  }

  async function generateMobileLinkToken() {
    setPending("mobile-token");
    setNotice("");
    try {
      const data = await parseApiResponse(await fetch("/api/mobile/link-token", { method: "POST" }));
      const token =
        typeof data?.data === "object" && data.data && "token" in data.data ? String(data.data.token) : "";
      setMobileLinkToken(token);
      if (!token) {
        setNotice("No mobile link token returned.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to generate mobile link token.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">{notice}</div>
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
              <Button size="sm" onClick={upgrade} disabled={pending === "upgrade"}>
                {pending === "upgrade" ? "Loading..." : "Upgrade to Premium"}
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={openBillingPortal} disabled={pending === "billing-portal"}>
                {pending === "billing-portal" ? "Loading..." : "Manage billing"}
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
                      {pending === trial.id ? "Updating..." : "Mark cancelled"}
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
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => startOAuthConnect("google")}
                disabled={pending === "oauth-google"}
              >
                {pending === "oauth-google" ? "Redirecting to Google..." : "Connect Gmail"}
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => startOAuthConnect("microsoft")}
                disabled={pending === "oauth-microsoft"}
              >
                {pending === "oauth-microsoft" ? "Redirecting to Microsoft..." : "Connect Outlook"}
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
                    {pending === "imap" ? "Connecting..." : "Connect IMAP"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{connections.length} provider connection(s) active</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Reminder channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={subscribeWebPush}
                disabled={pending === "web-push"}
              >
                <Bell className="mr-2 size-4" />
                {pending === "web-push" ? "Enabling..." : "Enable web push"}
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={generateMobileLinkToken}
                disabled={pending === "mobile-token"}
              >
                {pending === "mobile-token" ? "Generating..." : "Generate mobile link token"}
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
