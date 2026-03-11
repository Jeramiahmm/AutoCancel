"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignInCard({
  emailEnabled,
  googleEnabled,
  demoEnabled,
}: {
  emailEnabled: boolean;
  googleEnabled: boolean;
  demoEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function onMagicLinkSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setNotice(null);

    const result = await signIn("email", {
      email,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setPending(false);

    if (result?.ok) {
      setNotice("Check your inbox for your secure sign-in link.");
      return;
    }

    setNotice("Unable to send magic link. Please check your email and try again.");
  }

  async function onDemoSignIn() {
    setPending(true);
    setNotice(null);

    const result = await signIn("demo", {
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setPending(false);

    if (result?.url) {
      window.location.href = result.url;
      return;
    }

    setNotice("Demo sign-in is unavailable right now. Please refresh and try again.");
  }

  async function onGoogleSignIn() {
    setPending(true);
    setNotice(null);

    const result = await signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setPending(false);

    if (result?.url) {
      window.location.href = result.url;
      return;
    }

    setNotice("Google sign-in failed to start. Please try again.");
  }

  return (
    <Card className="w-full border-white/60 bg-white/80 shadow-glow backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-2xl [font-family:var(--font-display)]">Welcome to AutoCancel</CardTitle>
        <p className="text-sm text-muted-foreground">Secure by design, no email passwords required.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {demoEnabled ? (
          <Button className="w-full" size="lg" onClick={onDemoSignIn} disabled={pending}>
            {pending ? "Opening demo..." : "Try Demo"}
          </Button>
        ) : null}

        {emailEnabled ? (
          <form className="space-y-3" onSubmit={onMagicLinkSubmit}>
            <Input
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending link..." : "Email login"}
            </Button>
          </form>
        ) : null}

        {googleEnabled ? (
          <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={pending}>
            Continue with Google
          </Button>
        ) : null}

        {!emailEnabled && !googleEnabled && !demoEnabled ? (
          <p className="text-sm text-muted-foreground">
            No authentication provider is configured. Enable Demo Mode or configure OAuth/SMTP env vars.
          </p>
        ) : null}

        {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}

        <div className="grid gap-2 rounded-xl border border-white/70 bg-white/70 p-3 text-xs text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-primary" />
            OAuth-only access and encrypted token storage
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-primary" />
            Demo mode requires no external keys
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
