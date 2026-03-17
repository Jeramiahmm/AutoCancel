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
    <main className="relative min-h-screen overflow-hidden bg-[#efede8] px-4 py-12 text-[#141414] md:px-6">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <div className="w-full rounded-2xl border border-black/10 bg-white/65 p-7 backdrop-blur-sm">
          <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full border border-amber-900/20 bg-amber-900/10">
            <ShieldAlert className="size-5 text-amber-900" />
          </div>
          <h1 className="text-3xl font-semibold [font-family:var(--font-display)]">Auth Configuration Error</h1>
          <p className="mt-3 text-[#666159]">{message}</p>

          {productionIssues.length > 0 ? (
            <div className="mt-6 rounded-xl border border-black/10 bg-[#f8f5ef] p-4">
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#2b2925]">
                <AlertTriangle className="size-4 text-amber-900" />
                Required production auth settings are missing:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#666159]">
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
