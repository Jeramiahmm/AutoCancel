import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { getAuthErrorMessage } from "@/src/lib/auth-errors";
import {
  getProductionCriticalAuthIssues,
  hasEmailMagicLink,
  hasGoogleOAuth,
} from "@/src/lib/env";
import { SignInCard } from "@/components/marketing/sign-in-card";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const queryMessage = getAuthErrorMessage(params.error);
  const productionIssues = getProductionCriticalAuthIssues();
  const configMessage =
    productionIssues.length > 0
      ? `Auth setup incomplete: ${productionIssues.join(" ")}`
      : null;
  const initialNotice = configMessage ?? queryMessage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#efede8] text-[#141414]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 noise" />
        <div className="absolute -left-20 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#656159]">
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            Secure Access
          </span>

          <h1 className="editorial-hero max-w-xl text-5xl leading-[1.03] tracking-tight md:text-6xl">
            Your subscriptions,
            <span className="editorial-emphasis block">under control.</span>
          </h1>
          <p className="max-w-lg text-base text-[#666159] md:text-lg">
            Sign in to connect inbox providers, detect trial billing dates, and get reminders before auto-renewals.
          </p>

          <div className="grid gap-3 text-sm text-[#666159]">
            <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/55 px-3 py-2">
              <ShieldCheck className="size-4 text-[#141414]" strokeWidth={1.6} />
              OAuth-only integrations with encrypted tokens
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/55 px-3 py-2">
              <Lock className="size-4 text-[#141414]" strokeWidth={1.6} />
              No email passwords stored, ever
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto w-full max-w-lg">
          <SignInCard
            emailEnabled={hasEmailMagicLink()}
            googleEnabled={hasGoogleOAuth()}
            initialNotice={initialNotice}
          />
        </div>
      </div>
    </main>
  );
}
