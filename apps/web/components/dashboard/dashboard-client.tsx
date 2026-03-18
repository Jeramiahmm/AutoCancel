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

const panelClass = "rounded-3xl border border-black/10 bg-white/58 backdrop-blur-md";

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

  const activeRows = trials.filter((trial) => trial.status === "ACTIVE" || trial.status === "BILLING_SOON");

  return (
    <div className="space-y-6 pb-10">
      <section className="mx-auto flex max-w-6xl items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-[#8a857c]">Subscription Control Center</p>
          <h1 className="text-4xl text-[#121212] [font-family:var(--font-display)]">Dashboard</h1>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-black/15 bg-white/70"
          onClick={syncAll}
          disabled={pending === "sync"}
        >
          <RefreshCw className="mr-2 size-4" />
          {pending === "sync" ? "Syncing..." : "Sync inbox"}
        </Button>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-black/10 bg-[#f7f3ec] px-4 py-3 text-sm text-[#4b463f]">{notice}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        {[{ label: "Active trials", value: activeCount }, { label: "Billing soon", value: billingSoon.length }, { label: "Needs review", value: pendingReviewCount }].map((metric) => (
          <Card key={metric.label} className={panelClass}>
            <CardHeader>
              <CardTitle className="text-sm text-[#6a655d]">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-[#161616]">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-sm text-[#6a655d]">Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold text-[#181818]">{tier === "PREMIUM" ? "Premium" : "Free"}</p>
            {tier === "FREE" ? (
              <Button size="sm" className="rounded-full" onClick={upgrade} disabled={pending === "upgrade"}>
                {pending === "upgrade" ? "Loading..." : "Upgrade to Premium"}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-black/15 bg-transparent"
                onClick={openBillingPortal}
                disabled={pending === "billing-portal"}
              >
                {pending === "billing-portal" ? "Loading..." : "Manage billing"}
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-[#181818]">Active Trials</CardTitle>
            <p className="text-sm text-[#6a655d]">Track upcoming charges and mark cancelled in one click.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeRows.length === 0 ? (
              <div className="rounded-xl border border-black/10 bg-white/65 px-4 py-5 text-sm text-[#6a655d]">
                No active trials yet. Connect Gmail or Outlook to start scanning.
              </div>
            ) : (
              activeRows.map((trial) => (
                <div key={trial.id} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#151515]">{trial.serviceName}</p>
                      <p className="text-sm text-[#6a655d]">
                        Started {formatDate(trial.startDate)} | Bills {formatDate(trial.billingDate)}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(trial.status)}>{trial.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#5d5952]">{trial.daysRemaining} days remaining</p>
                    <Button
                      size="sm"
                      variant="danger"
                      className="rounded-full"
                      onClick={() => markCancelled(trial.id)}
                      disabled={pending === trial.id}
                    >
                      {pending === trial.id ? "Updating..." : "Mark cancelled"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={panelClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-[#181818]">
                <Sparkles className="size-4" />
                Connect providers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start rounded-full"
                variant="outline"
                onClick={() => startOAuthConnect("google")}
                disabled={pending === "oauth-google"}
              >
                {pending === "oauth-google" ? "Redirecting to Google..." : "Connect Gmail"}
              </Button>
              <Button
                className="w-full justify-start rounded-full"
                variant="outline"
                onClick={() => startOAuthConnect("microsoft")}
                disabled={pending === "oauth-microsoft"}
              >
                {pending === "oauth-microsoft" ? "Redirecting to Microsoft..." : "Connect Outlook"}
              </Button>

              <div className="rounded-2xl border border-black/10 bg-white/68 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7d786f]">OAuth2 IMAP fallback</p>
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
                  <Button className="w-full rounded-full" size="sm" onClick={connectImap} disabled={pending === "imap"}>
                    {pending === "imap" ? "Connecting..." : "Connect IMAP"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-[#6a655d]">{connections.length} provider connection(s) active</p>
            </CardContent>
          </Card>

          <Card className={panelClass}>
            <CardHeader>
              <CardTitle className="text-base text-[#181818]">Reminder channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-full"
                onClick={subscribeWebPush}
                disabled={pending === "web-push"}
              >
                <Bell className="mr-2 size-4" />
                {pending === "web-push" ? "Enabling..." : "Enable web push"}
              </Button>
              <div className="grid grid-cols-3 gap-2 text-xs text-[#6a655d]">
                <div className="rounded-xl border border-black/10 bg-white/60 p-2">
                  <CalendarClock className="mb-1 size-4" />
                  48h alert
                </div>
                <div className="rounded-xl border border-black/10 bg-white/60 p-2">
                  <Zap className="mb-1 size-4" />
                  24h alert
                </div>
                <div className="rounded-xl border border-black/10 bg-white/60 p-2">
                  <Shield className="mb-1 size-4" />
                  OAuth only
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start rounded-full"
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
        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-base text-[#181818]">Cancelled trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {cancelled.length ? (
              cancelled.slice(0, 5).map((trial) => (
                <div key={trial.id} className="rounded-xl border border-black/10 bg-white/65 px-3 py-2 text-[#2d2a26]">
                  {trial.serviceName}
                </div>
              ))
            ) : (
              <p className="text-[#6a655d]">No cancelled trials yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-base text-[#181818]">Completed subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {completed.length ? (
              completed.slice(0, 5).map((trial) => (
                <div key={trial.id} className="rounded-xl border border-black/10 bg-white/65 px-3 py-2 text-[#2d2a26]">
                  {trial.serviceName}
                </div>
              ))
            ) : (
              <p className="text-[#6a655d]">No completed subscriptions yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
