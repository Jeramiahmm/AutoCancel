"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutGrid, Settings, Sparkles, History, ListChecks } from "lucide-react";
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
    <header className="sticky top-4 z-40 rounded-[1.35rem] border border-black/10 bg-white/60 px-3 py-3 shadow-[0_18px_38px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f6f3ed] px-3 py-2 text-xs font-medium text-[#2f2c27]">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#171717] text-[11px] text-white">A</span>
          AutoCancel
        </Link>

        <nav className="mx-auto hidden items-center rounded-full border border-black/10 bg-[#f3f0ea] p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#3f3b35] transition-colors",
                  active ? "bg-[#ddd8cf] text-[#111111]" : "hover:text-[#111111]",
                )}
              >
                <Icon className="size-4 md:hidden" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-[#666159] md:inline-flex">
            <Sparkles className="size-3.5" />
            {email}
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#2f2c27]"
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
