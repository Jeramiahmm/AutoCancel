"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, SunMedium } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Timeline" },
  { href: "/pricing", label: "Insights" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
];

function linkClasses(active: boolean) {
  return active
    ? "bg-[#d9d4cc] text-[#111111]"
    : "text-[#282621]/85 transition-colors hover:text-[#111111]";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none sticky top-4 z-40 flex items-center justify-center px-3">
      <div className="pointer-events-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link href="/" className="justify-self-start text-xs font-semibold uppercase tracking-[0.18em] text-[#5f5b53]">
          AutoCancel
        </Link>

        <nav className="hidden items-center rounded-full border border-black/10 bg-[#f4f1ea]/90 p-1 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.45)] md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-7 py-2 text-sm font-semibold ${linkClasses(isActive)}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end">
          <Link
            href="/contact"
            className="mr-2 inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/65 text-[#131313] transition hover:bg-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/65 text-[#131313] transition hover:bg-white"
            aria-label="Sign in"
          >
            <SunMedium className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
