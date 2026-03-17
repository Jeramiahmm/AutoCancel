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
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pt-28">
        <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl [font-family:var(--font-display)]">
          Security architecture designed for trust
        </h1>
        <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
          We built AutoCancel to minimize data exposure while giving you reliable subscription visibility.
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {controls.map((control) => (
            <Card key={control.title} className="border-white/10 bg-white/[0.03] backdrop-blur-md">
              <CardHeader>
                <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
                  <control.icon className="size-5 text-blue-300" />
                </div>
                <CardTitle>{control.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">{control.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
          <h2 className="text-2xl font-semibold [font-family:var(--font-display)]">Need security details for your team?</h2>
          <p className="mt-3 max-w-2xl text-white/70">
            We can share implementation notes for OAuth scopes, token encryption, audit logging, and webhook verification.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/contact">Contact security</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Start secure setup</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
