import Link from "next/link";
import { requireAuth } from "@/src/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm text-white">A</span>
            <div>
              <p className="text-sm font-semibold">AutoCancel</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/history">History</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/review">Review</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
            <LogoutButton />
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
