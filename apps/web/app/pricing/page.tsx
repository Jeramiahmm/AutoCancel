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
      <Reveal className="mx-auto max-w-6xl px-4 pb-10 pt-24 text-center md:px-6 md:pt-28">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8c877e]">Simple Plans</p>
        <h1 className="editorial-hero text-5xl leading-[0.94] text-[#141414] md:text-7xl">Insights</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[#666159] md:text-lg">
          Clear pricing with no hidden fees. Start free, upgrade only when you need unlimited protection.
        </p>
      </Reveal>

      <Reveal className="px-4 pb-16 md:px-6">
        <PricingCards />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-black/10 bg-white/55 p-6 backdrop-blur-sm md:p-8">
          <h2 className="text-2xl [font-family:var(--font-display)] text-[#141414]">Plan comparison</h2>
          <div className="mt-5 space-y-3">
            {comparison.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-black/10 bg-[#f8f5ef] p-3 text-sm"
              >
                <p className="text-[#2e2b27]">{row.label}</p>
                <p className="min-w-[100px] text-right text-[#69645c]">{row.free}</p>
                <p className="min-w-[120px] text-right font-medium text-[#161616]">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-4 text-[#2d2d2d]" />
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
            <Button variant="outline" className="rounded-full border-black/15 bg-transparent" asChild>
              <Link href="/auth/signin">Upgrade to Premium</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
