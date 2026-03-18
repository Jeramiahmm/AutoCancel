import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efede8] text-[#131313]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 noise" />
        <div className="absolute -left-20 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute right-[-120px] top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_75%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
      <Link
        href="/auth/signin"
        className="fixed bottom-8 right-5 z-40 inline-flex size-11 items-center justify-center rounded-full border border-black/20 bg-[#2a2928] text-[#f0eee9] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)] transition hover:translate-y-[-1px] hover:bg-[#1e1d1c]"
        aria-label="Open AutoCancel sign in"
      >
        <SlidersHorizontal className="size-4" />
      </Link>
    </main>
  );
}
