import Link from "next/link";

const footerLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-4 py-14 md:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#141414]">AutoCancel</p>
          <p className="mt-2 max-w-md text-sm text-[#5e5a53]">
            Detect free trials, forecast upcoming charges, and cancel before billing hits.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-[#5e5a53]">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#151515]">
              {link.label}
            </Link>
          ))}
          <Link href="/auth/signin" className="transition-colors hover:text-[#151515]">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
