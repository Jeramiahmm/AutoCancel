import Image from "next/image";
import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import {
  FeatureBento,
  LiveMotionDashboard,
  PricingCards,
  Reveal,
  TrustedMarquee,
} from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <MarketingShell>
      <Reveal className="relative min-h-screen px-4 pb-24 pt-28 md:px-6 md:pb-32 md:pt-36">
        <div className="absolute inset-0">
          <ShaderAnimation className="h-full w-full" />
          <div className="absolute inset-0 bg-[#030303]/60" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/75">
              <Bot className="size-3.5" strokeWidth={1.5} />
              AI Trial Defense
            </span>
            <h1 className="max-w-3xl bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-semibold tracking-tighter text-transparent md:text-7xl [font-family:var(--font-display)]">
              Never forget to cancel a free trial again
            </h1>
            <p className="max-w-xl text-base text-white/70 md:text-lg">
              AutoCancel detects trial emails, computes billing dates, and warns you before charges happen.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full border border-white/10 px-7 shadow-[0_12px_40px_-18px_rgba(56,141,255,0.92)]"
                asChild
              >
                <Link href="/auth/signin">
                  <span className="relative z-10">Connect your email</span>
                  <span className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-300/0 via-blue-200/40 to-blue-300/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/[0.04]" asChild>
                <Link href="/features">Explore features</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <LiveMotionDashboard />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
                alt="Abstract dark premium UI placeholder"
                width={1600}
                height={900}
                className="h-48 w-full rounded-2xl object-cover object-center md:h-52"
                priority
              />
              <p className="mt-3 text-sm text-white/70">
                Detection confidence and upcoming renewals surfaced in one premium command center.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-7 text-3xl font-semibold tracking-tight md:text-4xl [font-family:var(--font-display)]">
            Bento intelligence, zero noise
          </h2>
          <FeatureBento />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <TrustedMarquee />
      </Reveal>

      <Reveal className="px-4 pb-28 md:px-6">
        <h2 className="mb-7 text-center text-3xl font-semibold tracking-tight md:text-4xl [font-family:var(--font-display)]">
          Pricing
        </h2>
        <PricingCards />
      </Reveal>
    </MarketingShell>
  );
}
