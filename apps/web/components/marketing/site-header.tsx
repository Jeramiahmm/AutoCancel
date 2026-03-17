"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function linkClasses(active: boolean) {
  return active
    ? "text-white"
    : "text-white/70 transition-colors hover:text-white";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40">
      <div className="mx-auto flex w-[min(1200px,calc(100%-1.5rem))] items-center justify-between rounded-full border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-xl md:px-5">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs">
            A
          </span>
          AutoCancel
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={linkClasses(isActive)}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="rounded-full text-white/90 hover:bg-white/10 hover:text-white" asChild>
            <Link href="/auth/signin">Log in</Link>
          </Button>
          <Button className="cta-shimmer rounded-full border border-white/10 shadow-[0_8px_36px_-12px_rgba(95,135,255,0.65)]" asChild>
            <Link href="/auth/signin">Connect Email</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
