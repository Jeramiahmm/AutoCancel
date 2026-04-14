import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/marketing/sections";

export default function ContactPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 text-center md:px-6 md:pt-28">
        <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-zinc-500">Reach us</p>
        <h1 className="text-5xl font-bold leading-[0.94] tracking-tight text-white md:text-7xl">Contact</h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-400 md:text-lg">
          Need help with integrations, deployment, security review, or billing? We reply quickly.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-[1fr_0.9fr] md:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-400">
            <p>Product support: support@autocancel.app</p>
            <p>Security contact: security@autocancel.app</p>
            <p>Docs and setup guides are available in your repository docs folder.</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/security">Security overview</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </MarketingShell>
  );
}
