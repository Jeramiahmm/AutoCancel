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
        <div className="rounded-xl border border-black/10 bg-[#f7f3ec] px-4 py-3 text-sm text-[#4b463f]">{notice}</div>
      ) : null}

      <Card className="rounded-3xl border-black/10 bg-white/58 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-[#171717]">Profile & timezone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="settings-name">
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
            <label className="text-sm text-muted-foreground" htmlFor="settings-email">
              Email
            </label>
            <Input id="settings-email" value={email} readOnly />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="settings-timezone">
              Timezone
            </label>
            <select
              id="settings-timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="h-10 w-full rounded-xl border border-black/15 bg-white/90 px-3 text-sm text-[#141414] outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <Card className="rounded-3xl border-black/10 bg-white/58 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-[#171717]">Connected providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedConnections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No providers connected yet.</p>
          ) : (
            sortedConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/68 p-3"
              >
                <div>
                  <p className="font-medium text-[#171717]">{connection.provider}</p>
                  <p className="text-sm text-[#6a655d]">
                    {connection.emailAddress ?? "No email returned"} · {connection.status}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-black/15 bg-transparent"
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
