import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { FeatureBento, LiveMotionDashboard, Reveal, TrustedMarquee } from "@/components/marketing/sections";

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pt-28">
        <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl [font-family:var(--font-display)]">
          Product features built for reliable cancellation protection
        </h1>
        <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
          AutoCancel combines inbox integrations, AI extraction, review workflows, and reminders so you have one
          trusted timeline for every trial and subscription.
        </p>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <FeatureBento />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <LiveMotionDashboard />
      </Reveal>

      <Reveal className="px-4 pb-12 md:px-6">
        <TrustedMarquee />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md">
          <h2 className="text-3xl font-semibold tracking-tight [font-family:var(--font-display)]">Ready to connect your inbox?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Start with Google OAuth, then add Outlook and IMAP fallback as needed.
          </p>
          <Button className="mt-6 rounded-full" size="lg" asChild>
            <Link href="/auth/signin">Connect Email</Link>
          </Button>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
