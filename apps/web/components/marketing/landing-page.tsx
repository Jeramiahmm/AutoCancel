import Link from "next/link";
import { Bell, Bot, Lock, MailSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDemoModeEnabled } from "@/src/lib/env";
import { TryDemoButton } from "@/components/marketing/try-demo-button";

const featureBento = [
  {
    title: "Inbox Intelligence",
    body: "Detect trial confirmations and recurring billing notices from Gmail, Outlook, and OAuth2 IMAP.",
    icon: MailSearch,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "AI Extraction",
    body: "Extract service name, trial length, billing date, and cost with confidence scoring.",
    icon: Bot,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "48h + 24h Alerts",
    body: "Never miss a cancellation window with coordinated reminders by email and push.",
    icon: Bell,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Security by Design",
    body: "OAuth-only access, encrypted tokens at rest, and least-privilege scopes.",
    icon: ShieldCheck,
    className: "md:col-span-2 md:row-span-1",
  },
];

const trustItems = ["OAuth-only", "Encrypted tokens", "No email passwords"];

export function LandingPage() {
  const demoEnabled = isDemoModeEnabled();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white [--background:220_10%_4%] [--foreground:0_0%_98%] [--muted:220_10%_12%] [--muted-foreground:220_8%_70%] [--card:220_11%_8%] [--card-foreground:0_0%_96%] [--border:220_10%_20%] [--input:220_10%_22%] [--ring:220_100%_68%] [--primary:217_100%_62%] [--primary-foreground:0_0%_100%]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute right-[-120px] top-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(95,135,255,0.35)_0%,rgba(95,135,255,0.03)_52%,rgba(95,135,255,0)_76%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-6 md:pt-8">
        <header className="sticky top-4 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.08]">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[13px]">
                A
              </span>
              AutoCancel
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
              <a className="transition-colors hover:text-white" href="#features">
                Features
              </a>
              <a className="transition-colors hover:text-white" href="#how">
                How it works
              </a>
              <a className="transition-colors hover:text-white" href="#pricing">
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-full text-white/90 hover:bg-white/10 hover:text-white" asChild>
                <Link href="/auth/signin">Log in</Link>
              </Button>
              <Button className="cta-shimmer rounded-full border border-white/10 shadow-[0_8px_36px_-12px_rgba(95,135,255,0.65)]" asChild>
                <Link href="/auth/signin">Connect your email</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid items-center gap-10 pb-20 pt-16 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
              <Sparkles className="size-3.5" strokeWidth={1.5} />
              Subscription Defense
            </span>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl [font-family:var(--font-display)]">
              Never forget to cancel a free trial again
            </h1>

            <p className="max-w-xl text-base text-white/70 md:text-lg">
              AutoCancel monitors your inbox for trial and subscription events, predicts charge dates, and alerts you
              before money leaves your card.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="cta-shimmer rounded-full border border-white/10 px-7 shadow-[0_10px_34px_-12px_rgba(95,135,255,0.7)]"
                asChild
              >
                <Link href="/auth/signin">Connect your email</Link>
              </Button>
              {demoEnabled ? (
                <TryDemoButton className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10" />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              {trustItems.map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-12 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.3),transparent_42%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(123,156,255,0.55)_0%,rgba(123,156,255,0.02)_72%)] blur-2xl" />
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">Billing Soon</p>
                  <p className="mt-2 text-xl font-semibold">Netflix Trial</p>
                  <p className="mt-1 text-sm text-white/65">Charges in 2 days • March 13</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/55">Detected Trials</p>
                    <p className="mt-1 text-2xl font-semibold">12</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/55">Saved This Month</p>
                    <p className="mt-1 text-2xl font-semibold">$94</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/[0.03] p-3 text-sm text-white/70">
                  48-hour and 24-hour reminders are active.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pb-16">
          <div className="mb-7 flex items-end justify-between gap-3">
            <h2 className="section-title text-white">Award-grade clarity, built for trust</h2>
            <p className="hidden text-sm text-white/55 md:block">Clean data in. Confident cancellation out.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureBento.map((feature) => (
              <Card
                key={feature.title}
                className={`relative overflow-hidden border-white/15 bg-white/[0.03] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${feature.className}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.13),transparent_48%)]" />
                <CardHeader className="relative">
                  <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/[0.06]">
                    <feature.icon className="size-4 text-white/90" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-sm text-white/70">{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" className="pb-16">
          <Card className="border-white/15 bg-white/[0.03] p-8 text-white md:p-10">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step 1</p>
                <h3 className="mt-2 text-xl font-semibold">Connect</h3>
                <p className="mt-2 text-sm text-white/65">Authorize inbox access with secure OAuth providers.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step 2</p>
                <h3 className="mt-2 text-xl font-semibold">Detect</h3>
                <p className="mt-2 text-sm text-white/65">AutoCancel parses trial signals and predicts billing.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step 3</p>
                <h3 className="mt-2 text-xl font-semibold">Act</h3>
                <p className="mt-2 text-sm text-white/65">Receive reminders with enough time to cancel safely.</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="pricing" className="pb-20">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-white/15 bg-white/[0.03] p-7 text-white">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="mt-3 text-4xl font-semibold">$0</p>
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                <li>Track up to 3 active trials</li>
                <li>Dashboard + manual sync</li>
                <li>Email and push reminders</li>
              </ul>
            </Card>

            <Card className="relative overflow-hidden border-primary/70 bg-white/[0.03] p-7 text-white shadow-[0_0_0_1px_rgba(95,135,255,0.3)_inset,0_18px_60px_-30px_rgba(95,135,255,0.6)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(95,135,255,0.22),transparent_45%)]" />
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-foreground/90">
                <Lock className="size-3.5" strokeWidth={1.6} />
                Recommended
              </p>
              <h3 className="mt-4 text-xl font-semibold">Premium</h3>
              <p className="mt-3 text-4xl font-semibold">
                $3<span className="text-base text-white/60">/month</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>Unlimited tracked subscriptions</li>
                <li>Advanced insights and review workflows</li>
                <li>Priority reminder reliability</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
