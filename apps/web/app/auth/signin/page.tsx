import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { hasEmailMagicLink, hasGoogleOAuth, isDemoModeEnabled } from "@/src/lib/env";
import { SignInCard } from "@/components/marketing/sign-in-card";

export default async function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white [--background:220_10%_4%] [--foreground:0_0%_98%] [--muted:220_10%_12%] [--muted-foreground:220_8%_70%] [--card:220_11%_8%] [--card-foreground:0_0%_96%] [--border:220_10%_20%] [--input:220_10%_22%] [--ring:220_100%_68%] [--primary:217_100%_62%] [--primary-foreground:0_0%_100%]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
        <div className="absolute right-[-140px] top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(95,135,255,0.35)_0%,rgba(95,135,255,0)_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            Secure Access
          </span>

          <h1 className="max-w-xl text-5xl leading-[1.03] tracking-tight md:text-6xl [font-family:var(--font-display)]">
            Your subscriptions, under control.
          </h1>
          <p className="max-w-lg text-base text-white/70 md:text-lg">
            Sign in to connect inbox providers, detect trial billing dates, and get reminders before auto-renewals.
          </p>

          <div className="grid gap-3 text-sm text-white/70">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2">
              <ShieldCheck className="size-4 text-white/90" strokeWidth={1.6} />
              OAuth-only integrations with encrypted tokens
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2">
              <Lock className="size-4 text-white/90" strokeWidth={1.6} />
              No email passwords stored, ever
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto w-full max-w-lg">
          <SignInCard
            emailEnabled={hasEmailMagicLink()}
            googleEnabled={hasGoogleOAuth()}
            demoEnabled={isDemoModeEnabled()}
          />
        </div>
      </div>
    </main>
  );
}
