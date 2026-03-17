import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { FeatureBento, LiveMotionDashboard, Reveal, TrustedMarquee } from "@/components/marketing/sections";

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 text-center md:px-6 md:pt-28">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#8c877e]">Your Journey</p>
        <h1 className="editorial-hero text-5xl leading-[0.94] text-[#141414] md:text-7xl">Timeline</h1>
        <p className="mx-auto mt-5 max-w-2xl text-[#666159] md:text-lg">
          Every moment that shapes your subscription story, beautifully organized and brought to life.
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-14 md:px-6">
        <LiveMotionDashboard />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-14 md:px-6">
        <FeatureBento />
      </Reveal>

      <Reveal className="px-4 pb-16 md:px-6">
        <TrustedMarquee />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-center backdrop-blur-sm">
          <h2 className="text-3xl [font-family:var(--font-display)] text-[#141414]">Ready to connect your inbox?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#666159]">
            Start with Google OAuth, then add Outlook and IMAP fallback as needed.
          </p>
          <Button className="mt-6 rounded-full px-8" size="lg" asChild>
            <Link href="/auth/signin">Connect Email</Link>
          </Button>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
