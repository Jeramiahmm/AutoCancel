import Link from "next/link";
import { KeyRound, Lock, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Reveal } from "@/components/marketing/sections";

const controls = [
  {
    title: "OAuth-only mailbox access",
    body: "AutoCancel never asks for mailbox passwords. Google and Microsoft use OAuth consent and scoped tokens.",
    icon: KeyRound,
  },
  {
    title: "Encrypted token storage",
    body: "Provider tokens are encrypted at rest and decrypted only for secure API calls needed during sync jobs.",
    icon: Lock,
  },
  {
    title: "Least-privilege permissions",
    body: "Read-only scopes are used for inbox scanning. We request only the permissions required for detection.",
    icon: ShieldCheck,
  },
  {
    title: "Billing isolation",
    body: "Subscription billing is managed through Stripe Checkout and Customer Portal without storing raw card details.",
    icon: WalletCards,
  },
];

export default function SecurityPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 text-center md:px-6 md:pt-28">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-zinc-500">Privacy First</p>
        <h1 className="text-5xl font-bold leading-[0.94] tracking-tight text-white md:text-7xl">Security</h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-400 md:text-lg">
          Built to minimize exposure with OAuth, encryption, and strict least-privilege controls.
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {controls.map((control) => (
            <Card key={control.title}>
              <CardHeader>
                <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-violet-500/10">
                  <control.icon className="size-5 text-violet-400" strokeWidth={1.6} />
                </div>
                <CardTitle>{control.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">{control.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-white">Need security details for your team?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            We can share implementation notes for OAuth scopes, token encryption, audit logging, and webhook verification.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button className="rounded-full" asChild>
              <Link href="/contact">Contact security</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/auth/signin">Start secure setup</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
