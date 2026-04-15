"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MailSearch, ShieldCheck, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BillingCycle = "monthly" | "yearly";

/* ── Provider SVG logos ── */

function GmailLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22 6.25V17.75C22 18.44 21.44 19 20.75 19H18V9.29L12 13.57L6 9.29V19H3.25C2.56 19 2 18.44 2 17.75V6.25C2 4.87 3.59 4.05 4.72 4.87L6 5.83L12 10.11L18 5.83L19.28 4.87C20.41 4.05 22 4.87 22 6.25Z" fill="#EA4335"/>
      <path d="M6 9.29V19H3.25C2.56 19 2 18.44 2 17.75V6.25C2 4.87 3.59 4.05 4.72 4.87L6 5.83L12 10.11L6 9.29Z" fill="#FBBC05"/>
      <path d="M18 9.29V19H20.75C21.44 19 22 18.44 22 17.75V6.25C22 4.87 20.41 4.05 19.28 4.87L18 5.83L12 10.11L18 9.29Z" fill="#34A853"/>
      <path d="M6 9.29L12 13.57L18 9.29L12 10.11L6 9.29Z" fill="#C5221F"/>
    </svg>
  );
}

function OutlookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M14 3V11.5L22 7.5V4C22 3.45 21.55 3 21 3H14Z" fill="#0364B8"/>
      <path d="M14 11.5V20L22 16V7.5L14 11.5Z" fill="#0078D4"/>
      <path d="M14 20H21C21.55 20 22 19.55 22 19V16L14 20Z" fill="#1490DF"/>
      <path d="M2 7C2 6.45 2.45 6 3 6H12C12.55 6 13 6.45 13 7V17C13 17.55 12.55 18 12 18H3C2.45 18 2 17.55 2 17V7Z" fill="#0078D4"/>
      <ellipse cx="7.5" cy="12" rx="3" ry="3.5" fill="white"/>
    </svg>
  );
}

function ProtonLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 8C4 6.9 4.9 6 6 6H18C19.1 6 20 6.9 20 8V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V8Z" fill="#6D4AFF"/>
      <path d="M4 8L12 13L20 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V18" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
    </svg>
  );
}

function FastmailLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="#69A3F0"/>
      <path d="M3 8L12 14L21 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export const featureCards = [
  {
    title: "Inbox Scanning",
    body: "Connects to Gmail, Outlook, and IMAP to find trial confirmations and renewal notices automatically.",
    icon: MailSearch,
  },
  {
    title: "Smart Extraction",
    body: "Pulls out the trial duration, billing date, service name, and cost from your emails.",
    icon: Zap,
  },
  {
    title: "Timely Alerts",
    body: "Sends you reminders 48 hours and 24 hours before any charge hits, in your local timezone.",
    icon: Bell,
  },
  {
    title: "Secure by Default",
    body: "OAuth-only access, encrypted tokens at rest, and we never store your email password.",
    icon: ShieldCheck,
  },
];

const scanItems = [
  { service: "Netflix Trial", due: "Charges in 2 days", amount: "$15.99", state: "BILLING_SOON" },
  { service: "Canva Pro", due: "Charges in 7 days", amount: "$12.99", state: "ACTIVE" },
  { service: "Notion AI", due: "Charges in 10 days", amount: "$10.00", state: "ACTIVE" },
  { service: "Grammarly Premium", due: "Charges in 13 days", amount: "$12.00", state: "ACTIVE" },
];

const trustedProviders = [
  { name: "Gmail", Logo: GmailLogo },
  { name: "Outlook", Logo: OutlookLogo },
  { name: "Proton Mail", Logo: ProtonLogo },
  { name: "Fastmail", Logo: FastmailLogo },
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
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Live Preview</p>
          <p className="text-sm text-zinc-300">Inbox scanning in real-time</p>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
        >
          {scanning ? "Scanning..." : "Complete"}
        </motion.span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
        {scanning ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-emerald-500/[0.08] to-transparent"
            animate={{ y: ["-12%", "420%"] }}
            transition={{ duration: 2.4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          />
        ) : null}

        <div className="space-y-2">
          {scanItems.map((item, index) => {
            const isVisible = index <= step;
            return (
              <div
                key={item.service}
                className={`flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.service}</p>
                  <p className="text-xs text-zinc-500">{item.due}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{item.amount}</p>
                  <p className="text-[11px] text-zinc-500">{item.state}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect your email",
      description: "Sign in with Google or link your mailbox via OAuth. We never see your password.",
      icon: Mail,
    },
    {
      number: "02",
      title: "We scan for subscriptions",
      description: "AutoCancel reads confirmation emails, receipts, and renewal notices to find every active trial and subscription.",
      icon: MailSearch,
    },
    {
      number: "03",
      title: "Get reminded before charges",
      description: "You'll get alerts 48 hours and 24 hours before any trial converts to a paid subscription.",
      icon: Clock,
    },
    {
      number: "04",
      title: "Cancel with confidence",
      description: "Review everything in your dashboard. Cancel what you don't need. Keep what you love. Never get surprised.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.number} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                {step.number}
              </span>
              <step.icon className="size-5 text-emerald-400/60" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>
          </div>
        ))}
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
            <div className="mb-2 inline-flex size-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <feature.icon className="size-5 text-emerald-400" strokeWidth={1.6} />
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
    <div className="mx-auto max-w-6xl rounded-3xl border border-white/[0.08] bg-white/[0.04] py-7 backdrop-blur-xl">
      <p className="mb-5 text-center text-xs uppercase tracking-[0.22em] text-zinc-500">Trusted by 10,000+ users</p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-3"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          {[...trustedProviders, ...trustedProviders].map((provider, index) => (
            <div
              key={`${provider.name}-${index}`}
              className="inline-flex min-w-[170px] items-center justify-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-3"
            >
              <provider.Logo className="size-5" />
              <span className="text-sm font-medium text-zinc-300">{provider.name}</span>
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
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-500"
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

        <article className="relative rounded-3xl border border-emerald-500/25 bg-white/[0.06] p-7 backdrop-blur-xl">
          <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Popular</span>
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
