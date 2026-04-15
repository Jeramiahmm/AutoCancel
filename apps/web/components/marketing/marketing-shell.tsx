import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 noise" />
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-160px] top-20 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
      <Link
        href="/auth/signin"
        className="fixed bottom-8 right-5 z-40 inline-flex size-11 items-center justify-center rounded-full bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition hover:translate-y-[-1px] hover:bg-white/90"
        aria-label="Back to top"
      >
        <ArrowUp className="size-4" />
      </Link>
    </main>
  );
}
