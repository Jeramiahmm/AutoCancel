import Link from "next/link";
import { Bell, Bot, MailSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDemoModeEnabled } from "@/src/lib/env";
import { TryDemoButton } from "@/components/marketing/try-demo-button";

const featureCards = [
  {
    title: "Inbox Intelligence",
    icon: MailSearch,
    body: "Scan Gmail, Outlook, and OAuth2 IMAP inboxes for trial confirmations and recurring billing signals.",
  },
  {
    title: "AI Extraction",
    icon: Bot,
    body: "Structured extraction for service, trial duration, billing date, and cost with confidence scoring.",
  },
  {
    title: "Charge Alerts",
    icon: Bell,
    body: "Get 48-hour and 24-hour reminders by email, web push, and mobile companion notifications.",
  },
  {
    title: "Security First",
    icon: ShieldCheck,
    body: "OAuth-only integrations, encrypted tokens at rest, and scoped access permissions.",
  },
];

export function LandingPage() {
  const demoEnabled = isDemoModeEnabled();

  return (
    <main className="relative noise">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="glass sticky top-4 z-40 rounded-full px-5 py-3 shadow-glow">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                A
              </span>
              AutoCancel
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Log in</Link>
              </Button>
              {demoEnabled ? <TryDemoButton /> : null}
              <Button asChild>
                <Link href="/auth/signin">Connect your email</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden pb-20 pt-20 md:pb-24 md:pt-28">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Sparkles className="size-3.5" />
                AI trial protection
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl md:leading-[1.05] [font-family:var(--font-display)]">
                Never forget to cancel a free trial again.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                AutoCancel detects trial and subscription emails, calculates billing dates, and warns you before
                your card gets charged.
              </p>
              <div className="flex flex-wrap gap-3">
                {demoEnabled ? <TryDemoButton className="h-12 px-6 text-base" /> : null}
                <Button size="lg" asChild>
                  <Link href="/auth/signin">Connect your email</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View demo dashboard</Link>
                </Button>
              </div>
            </div>
            <Card className="glass relative overflow-hidden border-white/60 shadow-glow">
              <CardHeader>
                <CardTitle>Billing soon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-white/50 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Netflix Trial</p>
                  <p className="mt-2 text-lg font-semibold">Charges in 2 days</p>
                  <p className="text-sm text-muted-foreground">Billing date: April 9</p>
                </div>
                <div className="rounded-xl border border-white/50 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Canva Pro</p>
                  <p className="mt-2 text-lg font-semibold">Charges in 7 days</p>
                  <p className="text-sm text-muted-foreground">Billing date: April 14</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="pb-14">
          <div className="mb-8 flex items-end justify-between gap-3">
            <h2 className="section-title">Built for fast subscription control</h2>
            <p className="hidden text-sm text-muted-foreground md:block">
              Inbox sync, AI extraction, and reminders in one flow.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((feature, i) => (
              <Card key={feature.title} className="glass animate-fade-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <CardHeader>
                  <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-white/90 shadow-sm">
                    <feature.icon className="size-4.5 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" className="pb-16">
          <Card className="glass p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
                <h3 className="mt-2 text-xl font-semibold">Connect Inbox</h3>
                <p className="mt-2 text-sm text-muted-foreground">OAuth login for Gmail, Outlook, or IMAP OAuth2.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                <h3 className="mt-2 text-xl font-semibold">Detect Trials</h3>
                <p className="mt-2 text-sm text-muted-foreground">AI and rules identify trial length and billing dates.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
                <h3 className="mt-2 text-xl font-semibold">Get Alerts</h3>
                <p className="mt-2 text-sm text-muted-foreground">Automatic reminders at 48h and 24h before charge.</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="pricing" className="pb-24">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-7">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="mt-3 text-4xl font-semibold">$0</p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Track up to 3 active trials</li>
                <li>Manual sync and dashboard visibility</li>
                <li>Email + push reminders</li>
              </ul>
            </Card>
            <Card className="relative overflow-hidden border-primary p-7 shadow-glow">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(12,125,141,0.14),transparent_35%,rgba(37,141,100,0.12))]" />
              <h3 className="text-xl font-semibold">Premium</h3>
              <p className="mt-3 text-4xl font-semibold">
                $3<span className="text-base text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Unlimited tracked trials and subscriptions</li>
                <li>Advanced insights and recurring trend view</li>
                <li>Priority reminder reliability</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
