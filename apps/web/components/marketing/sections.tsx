"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, BrainCircuit, Mail, MailCheck, MailSearch, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BillingCycle = "monthly" | "yearly";

export const featureCards = [
  {
    title: "Inbox Intelligence",
    body: "Scans Gmail, Outlook, and OAuth2 IMAP for trial confirmations and renewal notices.",
    icon: MailSearch,
  },
  {
    title: "AI Extraction",
    body: "Extracts trial duration, billing date, service name, and cost with confidence scoring.",
    icon: BrainCircuit,
  },
  {
    title: "Charge Prevention",
    body: "Schedules alerts 48h and 24h before billing in your local timezone.",
    icon: Bell,
  },
  {
    title: "Secure Integrations",
    body: "OAuth-only access, encrypted tokens at rest, and no stored mailbox passwords.",
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
    }, 1300);
    return () => window.clearInterval(timer);
  }, []);

  const visible = scanItems.slice(0, Math.min(step + 1, scanItems.length));
  const scanning = step < scanItems.length;
  const progress = Math.max(8, Math.round((Math.min(step + 1, scanItems.length) / scanItems.length) * 100));

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.04] p-4 shadow-glow-lg backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Live Dashboard</p>
          <p className="text-sm text-zinc-300">Real-time inbox scanning</p>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
        >
          {scanning ? "Scanning..." : "Complete"}
        </motion.span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
        {scanning ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-violet-500/10 to-transparent"
            animate={{ y: ["-12%", "420%"] }}
            transition={{ duration: 2.4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          />
        ) : null}

        <div className="space-y-2">
          {visible.map((item, index) => (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.service}</p>
                <p className="text-xs text-zinc-500">{item.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{item.amount}</p>
                <p className="text-[11px] text-zinc-500">{item.state}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">Gmail</span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">Outlook</span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">IMAP</span>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
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
      {featureCards.map((feature, index) => (
        <Card
          key={feature.title}
          className={index === 0 ? "md:col-span-2" : ""}
        >
          <CardHeader>
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-violet-500/10">
              <feature.icon className="size-5 text-violet-400" strokeWidth={1.6} />
            </div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-zinc-400">{feature.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-white/[0.08] bg-white/[0.04] py-7 shadow-glow-lg backdrop-blur-xl">
      <p className="mb-5 text-center text-xs uppercase tracking-[0.22em] text-zinc-500">Trusted by 10,000+ users</p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          {[...trustedBy, ...trustedBy].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-3 text-zinc-400"
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
        <div className="relative inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className="relative min-w-[110px] rounded-full px-4 py-2 text-sm font-medium capitalize text-zinc-400"
            >
              {billingCycle === cycle ? (
                <motion.span
                  layoutId="billing-toggle"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              ) : null}
              <span className={billingCycle === cycle ? "text-white" : ""}>
                {cycle}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Free</h3>
          <p className="mt-3 text-4xl font-semibold text-white">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-400">
            <li>Track up to 3 active trials</li>
            <li>Email + push reminders</li>
            <li>Dashboard + history</li>
          </ul>
        </article>

        <article className="relative rounded-3xl border border-violet-500/30 bg-white/[0.06] p-7 shadow-glow backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />
          <div className="relative">
            <h3 className="text-xl font-semibold text-white">Premium</h3>
            <p className="mt-3 text-4xl font-semibold text-white">
              {price}
              <span className="ml-1 text-base text-zinc-400">{suffix}</span>
            </p>
            <p className="mt-2 text-xs text-zinc-500">{billingCycle === "yearly" ? "Save 16% annually" : "Cancel anytime"}</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-300">
              <li>Unlimited tracked trials</li>
              <li>Advanced review insights</li>
              <li>Priority reminder delivery</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
