import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efede8] text-[#131313]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 noise" />
        <div className="absolute -left-20 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
