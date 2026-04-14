import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Reveal } from "@/components/marketing/sections";

export default function AboutPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 text-center md:px-6 md:pt-28">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-zinc-500">About AutoCancel</p>
        <h1 className="text-5xl font-bold leading-[0.94] tracking-tight text-white md:text-7xl">Built for control</h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-400 md:text-lg">
          We built AutoCancel after watching people lose money to silent trial renewals. The goal is simple: no surprises.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-[1fr_1fr] md:px-6">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">What we believe</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            <li>Users should never lose money because reminder emails are buried.</li>
            <li>Financial control tools should be simple, transparent, and secure.</li>
            <li>Production reliability matters more than flashy demos.</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
            alt="AutoCancel team abstract visual"
            width={1600}
            height={1000}
            className="h-full min-h-[220px] w-full rounded-2xl object-cover"
          />
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-white">Build your subscription command center</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Connect your inbox and start seeing every active trial in one timeline.
          </p>
          <Button className="mt-6 rounded-full px-8" asChild>
            <Link href="/auth/signin">Get started</Link>
          </Button>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
