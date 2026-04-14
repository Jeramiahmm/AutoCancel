import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 noise" />
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-160px] top-20 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
      <Link
        href="/auth/signin"
        className="fixed bottom-8 right-5 z-40 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-glow transition hover:translate-y-[-1px] hover:brightness-110"
        aria-label="Open AutoCancel sign in"
      >
        <Sparkles className="size-4" />
      </Link>
    </main>
  );
}
