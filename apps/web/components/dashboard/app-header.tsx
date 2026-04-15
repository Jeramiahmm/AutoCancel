"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutGrid, Settings, Mail, History, ListChecks } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { LogoutButton } from "@/components/dashboard/logout-button";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/history", label: "Timeline", icon: History },
  { href: "/review", label: "Review", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppHeader({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40 rounded-[1.35rem] border border-white/[0.08] bg-white/[0.04] px-3 py-3 shadow-[0_18px_38px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs font-medium text-zinc-300">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-zinc-950">A</span>
          AutoCancel
        </Link>

        <nav className="mx-auto hidden items-center rounded-full border border-white/[0.06] bg-white/[0.03] p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/[0.1] text-white" : "text-zinc-400 hover:text-white",
                )}
              >
                <Icon className="size-4 md:hidden" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs text-zinc-400 md:inline-flex">
            <Mail className="size-3.5" />
            {email}
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
