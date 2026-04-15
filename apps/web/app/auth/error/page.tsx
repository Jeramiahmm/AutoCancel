import Link from "next/link";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage } from "@/src/lib/auth-errors";
import { getProductionCriticalAuthIssues } from "@/src/lib/env";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message = getAuthErrorMessage(params.error) ?? "Authentication is temporarily unavailable.";
  const productionIssues = getProductionCriticalAuthIssues();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] px-4 py-12 text-white md:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-40 noise" />
        <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-xl">
          <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
            <ShieldAlert className="size-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold">Auth Configuration Error</h1>
          <p className="mt-3 text-zinc-400">{message}</p>

          {productionIssues.length > 0 ? (
            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-zinc-200">
                <AlertTriangle className="size-4 text-amber-400" />
                Required production auth settings are missing:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
                {productionIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/auth/signin">Back to sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
