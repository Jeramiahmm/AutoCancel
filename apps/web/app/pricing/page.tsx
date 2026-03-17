import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { PricingCards, Reveal } from "@/components/marketing/sections";

const comparison = [
  { label: "Active trial tracking", free: "Up to 3", premium: "Unlimited" },
  { label: "Reminder channels", free: "Email + push", premium: "Priority delivery" },
  { label: "AI extraction review queue", free: "Basic", premium: "Advanced insights" },
  { label: "Billing insights", free: "No", premium: "Yes" },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-10 pt-24 md:px-6 md:pt-28">
        <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl [font-family:var(--font-display)]">
          Clear pricing, no surprise add-ons
        </h1>
        <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
          Start free, then upgrade when you need unlimited trial tracking and deeper subscription insight.
        </p>
      </Reveal>

      <Reveal className="px-4 pb-16 md:px-6">
        <PricingCards />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8">
          <h2 className="text-2xl font-semibold [font-family:var(--font-display)]">Plan comparison</h2>
          <div className="mt-5 space-y-3">
            {comparison.map((row) => (
              <div key={row.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/10 p-3 text-sm">
                <p className="text-white/90">{row.label}</p>
                <p className="min-w-[100px] text-right text-white/65">{row.free}</p>
                <p className="min-w-[120px] text-right font-medium text-white">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-4 text-blue-300" />
                    {row.premium}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="rounded-full" asChild>
              <Link href="/auth/signin">Start for free</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/auth/signin">Upgrade to Premium</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
