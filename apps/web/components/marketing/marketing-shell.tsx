import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0c0f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 noise" />
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-160px] top-20 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.04)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
      <ScrollToTop />
    </main>
  );
}
