import { requireAuth } from "@/src/lib/auth-guard";
import { AppHeader } from "@/components/dashboard/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#efede8] px-4 py-6 text-[#141414] md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 opacity-55 noise" />
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <AppHeader email={session.user.email ?? "account"} />
        {children}
      </div>
    </div>
  );
}
