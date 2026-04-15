import { requireAuth } from "@/src/lib/auth-guard";
import { AppHeader } from "@/components/dashboard/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0c0f] px-4 py-6 text-white md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 opacity-40 noise" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-100px] bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.03)_0%,transparent_70%)] blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AppHeader email={session.user.email ?? "account"} />
        {children}
      </div>
    </div>
  );
}
