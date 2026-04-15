import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { FeatureBento, HowItWorks, LiveMotionDashboard, PricingCards, Reveal, TrustedMarquee } from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto flex min-h-[82vh] max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-16 text-center md:px-6">
        <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-zinc-500">Subscription Defense</p>
        <h1 className="text-5xl font-bold leading-[0.93] tracking-tight text-white md:text-8xl">
          Never forget to
          <span className="block">cancel a free trial</span>
          again
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-zinc-400">
          AutoCancel connects to your inbox, finds every free trial and subscription, and reminds you before you get charged. No more surprise renewals.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="cta-shimmer rounded-full px-8" asChild>
            <Link href="/auth/signin">Connect your email</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <Link href="/features" className="inline-flex items-center gap-2">
              See how it works
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <LiveMotionDashboard />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <TrustedMarquee />
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-zinc-400">
            Four steps to stop paying for subscriptions you forgot about.
          </p>
          <HowItWorks />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
            Built for peace of mind
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-zinc-400">
            AutoCancel handles the tedious work of tracking trials so you can focus on what matters.
          </p>
          <FeatureBento />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-28 md:px-6">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
          Simple pricing
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-zinc-400">
          Start free. Upgrade when you need more.
        </p>
        <PricingCards />
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/[0.08] bg-white/[0.04] px-6 py-10 text-center backdrop-blur-xl">
          <h3 className="text-3xl font-bold text-white">Stop paying for what you forgot about.</h3>
          <p className="mt-3 text-zinc-400">Connect once, track forever, and cancel before renewals hit your card.</p>
          <div className="mt-6 flex justify-center">
            <Button className="rounded-full px-8" asChild>
              <Link href="/auth/signin">Get started free</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
