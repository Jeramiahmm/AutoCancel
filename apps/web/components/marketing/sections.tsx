"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, BrainCircuit, Mail, MailCheck, MailSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BillingCycle = "monthly" | "yearly";

export const featureCards = [
  {
    title: "Inbox Intelligence",
    body: "Continuously scans Gmail, Outlook, and OAuth2 IMAP sources for trial confirmations and billing notices.",
    icon: MailSearch,
  },
  {
    title: "AI Extraction",
    body: "Extracts trial length, billing date, service, and cost with confidence scoring and human review fallback.",
    icon: BrainCircuit,
  },
  {
    title: "48h/24h Alerts",
    body: "Schedules reminders in your timezone before renewals to prevent missed cancellations.",
    icon: Bell,
  },
  {
    title: "Security First",
    body: "OAuth-only connections, encrypted token storage, and no email password handling.",
    icon: ShieldCheck,
  },
];

const scanItems = [
  { service: "Netflix Trial", due: "Charges in 2 days", amount: "$15.99", state: "BILLING_SOON" },
  { service: "Canva Pro", due: "Charges in 7 days", amount: "$12.99", state: "ACTIVE" },
  { service: "Notion AI", due: "Charges in 10 days", amount: "$10.00", state: "ACTIVE" },
  { service: "Grammarly Premium", due: "Charges in 13 days", amount: "$12.00", state: "ACTIVE" },
];

const trustedBy = [
  { name: "Gmail", icon: Mail },
  { name: "Outlook", icon: MailCheck },
  { name: "Proton", icon: ShieldCheck },
  { name: "Fastmail", icon: Mail },
  { name: "Hey", icon: MailCheck },
  { name: "Superhuman", icon: Sparkles },
];

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

export function LiveMotionDashboard() {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % (scanItems.length + 2));
    }, 1200);
    return () => window.clearInterval(timer);
  }, []);

  const visible = scanItems.slice(0, Math.min(step + 1, scanItems.length));
  const scanning = step < scanItems.length;
  const progress = Math.max(8, Math.round((Math.min(step + 1, scanItems.length) / scanItems.length) * 100));

  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/15 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_22px_60px_-34px_rgba(27,96,255,0.75)] backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Live Dashboard Preview</p>
          <p className="text-sm text-white/80">Real-time inbox scan</p>
        </div>
        <motion.span
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs text-white/75"
        >
          {scanning ? "Scanning..." : "Complete"}
        </motion.span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#030303]/80 p-3">
        {scanning ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/20 via-white/8 to-transparent"
            animate={{ y: ["-10%", "420%"] }}
            transition={{ duration: 2.2, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          />
        ) : null}

        <div className="space-y-2">
          {visible.map((item, index) => (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.service}</p>
                <p className="text-xs text-white/60">{item.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{item.amount}</p>
                <p className="text-[11px] text-white/55">{item.state}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-200"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function FeatureBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {featureCards.map((feature) => (
        <Card key={feature.title} className="border-white/10 bg-white/[0.03] backdrop-blur-md">
          <CardHeader>
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-400/10 shadow-[0_0_28px_rgba(56,141,255,0.26)]">
              <feature.icon className="size-5 text-blue-300" strokeWidth={1.6} />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70">{feature.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-6 backdrop-blur-md">
      <p className="mb-5 text-center text-xs uppercase tracking-[0.22em] text-white/60">
        Trusted by 10,000+ users
      </p>
      <div className="relative">
        <motion.div
          className="flex w-max items-center gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          {[...trustedBy, ...trustedBy].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-white/70"
            >
              <logo.icon className="size-4" strokeWidth={1.6} />
              <span className="text-sm font-medium">{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function PricingCards() {
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>("monthly");
  const price = billingCycle === "monthly" ? "$3" : "$30";
  const suffix = billingCycle === "monthly" ? "/month" : "/year";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className="relative min-w-[112px] rounded-full px-4 py-2 text-sm font-medium capitalize text-white/85"
            >
              {billingCycle === cycle ? (
                <motion.span
                  layoutId="billing-toggle"
                  className="absolute inset-0 -z-10 rounded-full bg-white/15"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              ) : null}
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-3 text-4xl font-semibold">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-white/70">
            <li>Track up to 3 active trials</li>
            <li>Email + push reminders</li>
            <li>Interactive dashboard + history</li>
          </ul>
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-blue-300/40 bg-white/[0.03] p-7 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(56,141,255,0.22),transparent_48%)]" />
          <h3 className="text-xl font-semibold">Premium</h3>
          <p className="mt-3 text-4xl font-semibold">
            {price}
            <span className="ml-1 text-base text-white/65">{suffix}</span>
          </p>
          <p className="mt-2 text-xs text-white/65">
            {billingCycle === "yearly" ? "Save 16% annually" : "Cancel anytime"}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/75">
            <li>Unlimited tracked trials</li>
            <li>Advanced confidence review queue</li>
            <li>Priority reminder delivery</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
