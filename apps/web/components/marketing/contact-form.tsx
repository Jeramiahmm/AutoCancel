"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice("");

    try {
      await parseApiResponse(
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
      );
      setNotice("Thanks. Your message was received and our team will follow up shortly.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send your message right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <Input
          required
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </div>

      <Input
        placeholder="Company (optional)"
        value={form.company}
        onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
      />

      <textarea
        required
        minLength={10}
        className="min-h-[140px] w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/30"
        placeholder="How can we help?"
        value={form.message}
        onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
      />

      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>

      {notice ? <p className="text-sm text-zinc-400">{notice}</p> : null}
    </form>
  );
}
