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
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f7f4ee]/80 p-4 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.45)] backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#7f7a72]">Live Dashboard</p>
          <p className="text-sm text-[#2a2825]">Real-time inbox scanning</p>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-[#3b3935]"
        >
          {scanning ? "Scanning..." : "Complete"}
        </motion.span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white/70 p-3">
        {scanning ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/8 to-transparent"
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
              className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f8f5ef] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-[#121212]">{item.service}</p>
                <p className="text-xs text-[#716d66]">{item.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#121212]">{item.amount}</p>
                <p className="text-[11px] text-[#716d66]">{item.state}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-black/10">
        <motion.div
          className="h-full rounded-full bg-black"
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
        <Card key={feature.title} className="rounded-3xl border-black/10 bg-white/55 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-black/10 bg-[#efede8]">
              <feature.icon className="size-5 text-[#121212]" strokeWidth={1.6} />
            </div>
            <CardTitle className="text-[#121212]">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-[#65615a]">{feature.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-black/10 bg-white/55 py-7 backdrop-blur-sm">
      <p className="mb-5 text-center text-xs uppercase tracking-[0.22em] text-[#7f7a72]">Trusted by 10,000+ users</p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          {[...trustedBy, ...trustedBy].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl border border-black/10 bg-[#f8f5ef] px-5 py-3 text-[#4f4a44]"
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
        <div className="relative inline-flex rounded-full border border-black/10 bg-white/60 p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBillingCycle(cycle)}
              className="relative min-w-[110px] rounded-full px-4 py-2 text-sm font-medium capitalize text-[#3d3933]"
            >
              {billingCycle === cycle ? (
                <motion.span
                  layoutId="billing-toggle"
                  className="absolute inset-0 -z-10 rounded-full bg-[#ddd8cf]"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              ) : null}
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-black/10 bg-white/55 p-7 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-[#121212]">Free</h3>
          <p className="mt-3 text-4xl font-semibold text-[#121212]">$0</p>
          <ul className="mt-6 space-y-2 text-sm text-[#5f5b53]">
            <li>Track up to 3 active trials</li>
            <li>Email + push reminders</li>
            <li>Dashboard + history</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-black/20 bg-[#f8f5ee] p-7 shadow-[0_16px_40px_-32px_rgba(0,0,0,0.55)]">
          <h3 className="text-xl font-semibold text-[#121212]">Premium</h3>
          <p className="mt-3 text-4xl font-semibold text-[#121212]">
            {price}
            <span className="ml-1 text-base text-[#5f5b53]">{suffix}</span>
          </p>
          <p className="mt-2 text-xs text-[#5f5b53]">{billingCycle === "yearly" ? "Save 16% annually" : "Cancel anytime"}</p>
          <ul className="mt-6 space-y-2 text-sm text-[#4e4a43]">
            <li>Unlimited tracked trials</li>
            <li>Advanced review insights</li>
            <li>Priority reminder delivery</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
