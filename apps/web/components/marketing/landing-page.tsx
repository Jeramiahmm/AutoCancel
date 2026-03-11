import Link from "next/link";
import { Bell, Bot, MailSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundPaths } from "@/components/ui/background-paths";
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
    body: "Extract service name, trial length, billing date, and price with confidence scoring.",
  },
  {
    title: "Charge Alerts",
    icon: Bell,
    body: "Get reminders at 48h and 24h before billing through email, web push, and mobile push.",
  },
  {
    title: "Security First",
    icon: ShieldCheck,
    body: "OAuth tokens only, encrypted at rest, and least-privilege scopes across integrations.",
  },
];

const trustItems = ["OAuth-only access", "Encrypted provider tokens", "No email passwords stored"];

export function LandingPage() {
  const demoEnabled = isDemoModeEnabled();

  return (
    <main className="relative noise">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="glass sticky top-4 z-40 rounded-full px-5 py-3 shadow-glow">
          <div className="flex items-center justify-between gap-3">
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
              <Button variant="ghost" className="rounded-full" asChild>
                <Link href="/auth/signin">Log in</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/auth/signin">Connect your email</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="size-3.5" />
              AI trial protection
            </span>

            <BackgroundPaths
              title="Never forget to cancel a free trial again."
              subtitle="AutoCancel detects subscriptions from your inbox, predicts billing dates, and reminds you before the charge hits."
              ctaLabel="Connect your email"
              ctaHref="/auth/signin"
            />

            <div className="flex flex-wrap items-center gap-3">
              {demoEnabled ? <TryDemoButton className="rounded-full px-6" /> : null}
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <a href="#features">Explore features</a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {trustItems.map((item) => (
                <span key={item} className="rounded-full border border-white/70 bg-white/65 px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="pb-14">
          <div className="mb-8 flex items-end justify-between gap-3">
            <h2 className="section-title">Built for fast subscription control</h2>
            <p className="hidden text-sm text-muted-foreground md:block">
              Inbox sync, extraction, reminders, and review queue in one flow.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((feature, i) => (
              <Card key={feature.title} className="glass animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
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
                <p className="mt-2 text-sm text-muted-foreground">Use OAuth to connect Gmail, Outlook, or IMAP OAuth2.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                <h3 className="mt-2 text-xl font-semibold">Detect Trials</h3>
                <p className="mt-2 text-sm text-muted-foreground">AI + rules detect trial length, price, and billing date.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
                <h3 className="mt-2 text-xl font-semibold">Get Alerts</h3>
                <p className="mt-2 text-sm text-muted-foreground">Receive 48h and 24h reminders to cancel on time.</p>
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
                <li>Dashboard + manual inbox sync</li>
                <li>Email and push reminders</li>
              </ul>
            </Card>
            <Card className="relative overflow-hidden border-primary p-7 shadow-glow">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(12,125,141,0.14),transparent_35%,rgba(37,141,100,0.12))]" />
              <h3 className="text-xl font-semibold">Premium</h3>
              <p className="mt-3 text-4xl font-semibold">
                $3<span className="text-base text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Unlimited tracked subscriptions</li>
                <li>Advanced trial insights</li>
                <li>Priority reminder reliability</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
