import { Lock, ShieldCheck } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 noise" />
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
            <ShieldCheck className="size-3.5" strokeWidth={1.5} />
            Secure Access
          </span>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.03] tracking-tight md:text-6xl">
            Your subscriptions,
            <span className="gradient-text block">under control.</span>
          </h1>
          <p className="max-w-lg text-base text-zinc-400 md:text-lg">
            Sign in to connect inbox providers, detect trial billing dates, and get reminders before auto-renewals.
          </p>

          <div className="grid gap-3 text-sm text-zinc-400">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <ShieldCheck className="size-4 text-zinc-300" strokeWidth={1.6} />
              OAuth-only integrations with encrypted tokens
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
              <Lock className="size-4 text-zinc-300" strokeWidth={1.6} />
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
