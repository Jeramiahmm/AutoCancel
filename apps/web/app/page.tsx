import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { FeatureBento, LiveMotionDashboard, PricingCards, Reveal, TrustedMarquee } from "@/components/marketing/sections";

export default function HomePage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto flex min-h-[84vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-20 text-center md:px-6">
        <p className="mb-6 text-[11px] uppercase tracking-[0.28em] text-[#8c877e]">A Subscription Timeline You Can Trust</p>
        <h1 className="editorial-hero text-5xl font-semibold leading-[0.95] text-[#131313] md:text-8xl">
          Your subscriptions,
          <span className="editorial-emphasis block">intelligently</span>
          mapped
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-[#666159]">
          Never forget to cancel a free trial again. AutoCancel reads billing events from your inbox and warns you before charges happen.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="cta-shimmer rounded-full px-8" asChild>
            <Link href="/auth/signin">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-black/15 bg-transparent px-8" asChild>
            <Link href="/features">View Insights</Link>
          </Button>
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-4xl italic tracking-tight text-[#171717] [font-family:var(--font-mono)] md:text-6xl">
            Timeline
          </h2>
          <LiveMotionDashboard />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-7 text-center text-3xl tracking-tight text-[#171717] [font-family:var(--font-display)] md:text-4xl">
            Features
          </h2>
          <FeatureBento />
        </div>
      </Reveal>

      <Reveal className="px-4 pb-20 md:px-6">
        <TrustedMarquee />
      </Reveal>

      <Reveal className="px-4 pb-28 md:px-6">
        <h2 className="mb-7 text-center text-3xl tracking-tight text-[#171717] [font-family:var(--font-display)] md:text-4xl">
          Pricing
        </h2>
        <PricingCards />
      </Reveal>
      <Reveal className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-black/10 bg-white/60 px-6 py-10 text-center backdrop-blur-sm">
          <h3 className="text-3xl [font-family:var(--font-display)]">Your life, mapped. Your charges, controlled.</h3>
          <p className="mt-3 text-[#666159]">
            Connect once and get a clean subscription timeline across Gmail, Outlook, and IMAP.
          </p>
          <div className="mt-6 flex justify-center">
            <Button className="rounded-full px-8" asChild>
              <Link href="/auth/signin">Connect your email</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
