import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Reveal } from "@/components/marketing/sections";

export default function AboutPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pt-28">
        <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl [font-family:var(--font-display)]">
          AutoCancel helps people avoid accidental subscription charges
        </h1>
        <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
          We built AutoCancel after seeing how easy it is to miss trial deadlines across multiple inboxes and tools.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-[1fr_1fr] md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md">
          <h2 className="text-2xl font-semibold [font-family:var(--font-display)]">What we believe</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li>Users should never lose money because reminder emails are buried.</li>
            <li>Financial control tools should be simple, transparent, and secure.</li>
            <li>Production reliability matters more than flashy demos.</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
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
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md">
          <h2 className="text-2xl font-semibold [font-family:var(--font-display)]">Build your subscription command center</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Connect your inbox and start seeing every active trial in one timeline.
          </p>
          <Button className="mt-6 rounded-full" asChild>
            <Link href="/auth/signin">Get started</Link>
          </Button>
        </div>
      </Reveal>
    </MarketingShell>
  );
}
