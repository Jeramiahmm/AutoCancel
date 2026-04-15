"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Connection = {
  id: string;
  provider: "GOOGLE" | "MICROSOFT" | "IMAP";
  status: string;
  emailAddress: string | null;
  createdAt: string;
};

const timezoneOptions = [
  "America/Denver",
  "America/Los_Angeles",
  "America/New_York",
  "America/Chicago",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

async function parseApiResponse(response: Response) {
  const payload = await response.json().catch(() => null);

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

  return payload as { data?: unknown };
}

export function SettingsPanel({
  name: initialName,
  email,
  timezone: initialTimezone,
  connections,
}: {
  name: string;
  email: string;
  timezone: string;
  connections: Connection[];
}) {
  const [name, setName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>("");

  const sortedConnections = useMemo(
    () => [...connections].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))),
    [connections],
  );

  async function saveProfile() {
    setPending("profile");
    setNotice("");
    try {
      await parseApiResponse(
        await fetch("/api/user/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, timezone }),
        }),
      );
      setNotice("Profile settings updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update profile settings.");
    } finally {
      setPending(null);
    }
  }

  async function disconnectConnection(provider: "GOOGLE" | "MICROSOFT" | "IMAP") {
    setPending(`disconnect-${provider}`);
    setNotice("");
    try {
      await parseApiResponse(
        await fetch(`/api/integrations/${provider.toLowerCase()}/disconnect`, {
          method: "POST",
        }),
      );
      setNotice(`${provider} disconnected.`);
      window.location.reload();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : `Unable to disconnect ${provider}.`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">{notice}</div>
      ) : null}

      <Card className="rounded-3xl border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Profile & timezone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400" htmlFor="settings-name">
              Name
            </label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400" htmlFor="settings-email">
              Email
            </label>
            <Input id="settings-email" value={email} readOnly />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400" htmlFor="settings-timezone">
              Timezone
            </label>
            <select
              id="settings-timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 text-sm text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              {timezoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Button className="rounded-full" onClick={saveProfile} disabled={pending === "profile"}>
            {pending === "profile" ? "Saving..." : "Save settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Connected providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedConnections.length === 0 ? (
            <p className="text-sm text-zinc-500">No providers connected yet.</p>
          ) : (
            sortedConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
              >
                <div>
                  <p className="font-medium text-white">{connection.provider}</p>
                  <p className="text-sm text-zinc-400">
                    {connection.emailAddress ?? "No email returned"} · {connection.status}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => disconnectConnection(connection.provider)}
                  disabled={pending === `disconnect-${connection.provider}`}
                >
                  {pending === `disconnect-${connection.provider}` ? "Disconnecting..." : "Disconnect"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
