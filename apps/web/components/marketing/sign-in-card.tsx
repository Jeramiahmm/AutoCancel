"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
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

  return (
    <Card className="w-full border-white/60 bg-white/75 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to AutoCancel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {demoEnabled ? (
          <Button
            className="w-full"
            size="lg"
            onClick={() => signIn("demo", { callbackUrl: "/dashboard" })}
          >
            Try Demo
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
          <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            Continue with Google
          </Button>
        ) : null}

        {!emailEnabled && !googleEnabled && !demoEnabled ? (
          <p className="text-sm text-muted-foreground">
            No authentication provider is configured. Enable Demo Mode or configure OAuth/SMTP env vars.
          </p>
        ) : null}

        {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}
      </CardContent>
    </Card>
  );
}
