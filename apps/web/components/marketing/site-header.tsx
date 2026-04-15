"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Timeline" },
  { href: "/pricing", label: "Insights" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
];

function linkClasses(active: boolean) {
  return active
    ? "bg-white/[0.1] text-white"
    : "text-zinc-400 transition-colors hover:text-white";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none sticky top-4 z-40 flex items-center justify-center px-3">
      <div className="pointer-events-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link href="/" className="justify-self-start inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">A</span>
          AutoCancel
        </Link>

        <nav className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.04] p-1 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-7 py-2 text-sm font-medium ${linkClasses(isActive)}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end">
          <Link
            href="/contact"
            className="mr-2 inline-flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Sign in"
          >
            <User className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
