"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Bell,
  Bot,
  Inbox,
  MailSearch,
  ShieldCheck,
  Sparkles,
  Mail,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TryDemoButton } from "@/components/marketing/try-demo-button";

type BillingCycle = "monthly" | "yearly";

const featureBento = [
  {
    title: "Inbox Intelligence",
    body: "Scans Gmail, Outlook, and OAuth2 IMAP for trial confirmations, renewals, and billing notices.",
    icon: MailSearch,
    className: "md:col-span-3",
  },
  {
    title: "AI Extraction",
    body: "Extracts service, trial length, billing date, and price with confidence scoring.",
    icon: Bot,
    className: "md:col-span-3",
  },
  {
    title: "Reminder Automation",
    body: "Sends 48h and 24h reminders before your payment method is charged.",
    icon: Bell,
    className: "md:col-span-2",
  },
  {
    title: "Secure by Design",
    body: "OAuth-only permissions, encrypted tokens, and no email passwords stored.",
    icon: ShieldCheck,
    className: "md:col-span-4",
  },
];

const scanFeed = [
  { service: "Netflix Trial", eta: "Charges in 2 days", amount: "$15.99", status: "BILLING_SOON" },
  { service: "Canva Pro", eta: "Charges in 7 days", amount: "$12.99", status: "ACTIVE" },
  { service: "Notion AI", eta: "Charges in 10 days", amount: "$10.00", status: "ACTIVE" },
  { service: "Grammarly Premium", eta: "Charges in 13 days", amount: "$12.00", status: "ACTIVE" },
];

const logoItems = [
  { name: "Gmail", icon: Mail },
  { name: "Outlook", icon: Inbox },
  { name: "Proton", icon: Shield },
];

function Magnetic({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.3 });
  const smoothY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.3 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * 0.12);
    y.set(offsetY * 0.12);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

function LiveDashboardPreview() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % (scanFeed.length + 2));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  const count = Math.min(step + 1, scanFeed.length);
  const visibleItems = scanFeed.slice(0, count);
  const scanning = step < scanFeed.length;
  const progress = Math.min((step + 1) / scanFeed.length, 1);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_24px_70px_-36px_rgba(0,0,0,0.95)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Live Detection Preview</p>
          <p className="text-sm text-white/75">Inbox scanning in real-time</p>
        </div>
        <motion.span
          className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-white/75"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
        >
          {scanning ? "Scanning..." : "Scan complete"}
        </motion.span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
        {scanning ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/25 via-white/10 to-transparent"
            animate={{ y: ["-12%", "460%"] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        ) : null}

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.service}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.service}</p>
                  <p className="text-xs text-white/60">{item.eta}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{item.amount}</p>
                  <p className="text-[11px] text-white/50">{item.status}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-1.5 w-full rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-200"
            animate={{ width: `${Math.max(6, progress * 100)}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export function PremiumLanding({ demoEnabled }: { demoEnabled: boolean }) {
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("monthly");

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 26 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 26 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}px ${glowY}px, rgba(120,156,255,0.18), transparent 60%)`;

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(-500);
    mouseY.set(-500);
  }

  const premiumPrice = billingCycle === "monthly" ? "$3" : "$30";
  const premiumSuffix = billingCycle === "monthly" ? "/month" : "/year";

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white [--background:220_10%_4%] [--foreground:0_0%_98%] [--muted:220_10%_12%] [--muted-foreground:220_8%_70%] [--card:220_11%_8%] [--card-foreground:0_0%_96%] [--border:220_10%_20%] [--input:220_10%_22%] [--ring:220_100%_68%] [--primary:217_100%_62%] [--primary-foreground:0_0%_100%]"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_72%)] blur-3xl" />
        <div className="absolute right-[-120px] top-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(95,135,255,0.34),transparent_74%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-6 md:pt-8">
        <header className="sticky top-4 z-40">
          <motion.div
            className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 backdrop-blur-xl"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            transition={{ duration: 0.2 }}
          >
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
              <a className="transition-colors hover:text-white" href="#social-proof">
                Trust
              </a>
              <a className="transition-colors hover:text-white" href="#pricing">
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-full text-white/90 hover:bg-white/10 hover:text-white" asChild>
                <Link href="/auth/signin">Log in</Link>
              </Button>
              <Magnetic>
                <Button className="cta-shimmer rounded-full border border-white/10 shadow-[0_8px_36px_-12px_rgba(95,135,255,0.65)]" asChild>
                  <Link href="/auth/signin">Connect your email</Link>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </header>

        <section className="grid items-center gap-10 pb-20 pt-16 md:grid-cols-[1.08fr_0.92fr] md:pt-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
              <Sparkles className="size-3.5" strokeWidth={1.5} />
              Premium Subscription Defense
            </span>

            <h1 className="max-w-3xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-semibold tracking-tighter text-transparent md:text-7xl [font-family:var(--font-display)]">
              Never forget to cancel a free trial again
            </h1>

            <p className="max-w-xl text-base text-white/70 md:text-lg">
              AutoCancel scans your inbox, extracts trial details, and warns you before renewals hit your card.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button
                  size="lg"
                  className="cta-shimmer rounded-full border border-white/10 px-7 shadow-[0_10px_34px_-12px_rgba(95,135,255,0.7)]"
                  asChild
                >
                  <Link href="/auth/signin">Connect your email</Link>
                </Button>
              </Magnetic>
              {demoEnabled ? (
                <Magnetic>
                  <TryDemoButton className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10" />
                </Magnetic>
              ) : null}
            </div>
          </div>

          <LiveDashboardPreview />
        </section>

        <section id="features" className="pb-16">
          <div className="mb-7 flex items-end justify-between gap-3">
            <h2 className="section-title text-white">A strict, elegant command center</h2>
            <p className="hidden text-sm text-white/55 md:block">Clean signal, zero clutter.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-6">
            {featureBento.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent p-px ${feature.className}`}
              >
                <Card className="h-full border border-white/10 bg-white/[0.03] backdrop-blur-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <CardHeader>
                    <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
                      <feature.icon className="size-4.5 text-white/90" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70">{feature.body}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        <section id="social-proof" className="pb-16">
          <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-6">
            <p className="text-center text-sm font-medium uppercase tracking-[0.22em] text-white/60">
              Trusted by 10,000+ users
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {logoItems.map((logo) => (
                <div
                  key={logo.name}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-3 text-white/85"
                >
                  <logo.icon className="size-4" strokeWidth={1.7} />
                  <span className="text-sm font-medium tracking-wide">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pb-20">
          <div className="mb-6 flex flex-col items-center gap-4">
            <h2 className="section-title text-white">Simple pricing</h2>
            <div className="relative inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1">
              {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className="relative z-10 min-w-[112px] rounded-full px-4 py-2 text-sm font-medium capitalize text-white/80"
                >
                  {billingCycle === cycle ? (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 z-[-1] rounded-full bg-white/14"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  ) : null}
                  {cycle}
                </button>
              ))}
            </div>
          </div>

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
              <h3 className="text-xl font-semibold">Premium</h3>
              <p className="mt-3 text-4xl font-semibold">
                {premiumPrice}
                <span className="text-base text-white/60">{premiumSuffix}</span>
              </p>
              <p className="mt-2 text-xs text-white/60">{billingCycle === "yearly" ? "Save 16% annually" : "Cancel anytime"}</p>
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
