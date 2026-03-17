"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignInCard({
  emailEnabled,
  googleEnabled,
  initialNotice,
}: {
  emailEnabled: boolean;
  googleEnabled: boolean;
  initialNotice?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(initialNotice ?? null);

  function getProviderError(result?: { error?: string | null }) {
    if (!result?.error) {
      return null;
    }

    if (result.error === "OAuthSignin" || result.error === "OAuthCallback") {
      return "OAuth could not start. Verify GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET and callback URLs.";
    }

    if (result.error === "Configuration") {
      return "Authentication provider is not configured correctly.";
    }

    return result.error;
  }

  async function onMagicLinkSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.ok) {
        setNotice("Check your inbox for your secure sign-in link.");
        return;
      }

      const providerError = getProviderError(result);
      setNotice(providerError ?? "Unable to send magic link. Please check your email and try again.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send magic link right now.");
    } finally {
      setPending(false);
    }
  }

  async function onGoogleSignIn() {
    setPending(true);
    setNotice(null);
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      const providerError = getProviderError(result);
      setNotice(providerError ?? "Google sign-in failed to start. Please try again.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Google sign-in failed unexpectedly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full border-black/10 bg-white/70 text-[#141414] shadow-[0_20px_45px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl [font-family:var(--font-display)]">Welcome to AutoCancel</CardTitle>
        <p className="text-sm text-[#666159]">Secure by design, no email passwords required.</p>
      </CardHeader>
      <CardContent className="space-y-5">
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
          <Button
            variant="outline"
            className="w-full border-black/15 bg-transparent hover:bg-black/[0.03]"
            onClick={onGoogleSignIn}
            disabled={pending}
          >
            Continue with Google
          </Button>
        ) : null}

        {!emailEnabled && !googleEnabled ? (
          <p className="text-sm text-[#666159]">
            No authentication provider is configured. Configure Google OAuth or SMTP magic links.
          </p>
        ) : null}

        {notice ? <p className="text-sm text-[#666159]">{notice}</p> : null}

        <div className="grid gap-2 rounded-xl border border-black/10 bg-[#f6f3ec] p-3 text-xs text-[#666159]">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-[#141414]" />
            OAuth-only access and encrypted token storage
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
