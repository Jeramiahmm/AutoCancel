import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/marketing/sections";

export default function ContactPage() {
  return (
    <MarketingShell>
      <Reveal className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pt-28">
        <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-6xl [font-family:var(--font-display)]">
          Contact the AutoCancel team
        </h1>
        <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
          Need help with integrations, deployment, security review, or billing? We respond quickly.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-[1fr_0.9fr] md:px-6">
        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md">
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/75">
            <p>Product support: support@autocancel.app</p>
            <p>Security contact: security@autocancel.app</p>
            <p>Docs and setup guides are available in your repository docs folder.</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" asChild>
                <Link href="/security">Security overview</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </MarketingShell>
  );
}
