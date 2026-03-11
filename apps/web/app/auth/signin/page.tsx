import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth";
import { hasEmailMagicLink, hasGoogleOAuth, isDemoModeEnabled } from "@/src/lib/env";
import { SignInCard } from "@/components/marketing/sign-in-card";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default async function SignInPage() {
  const session = await getAuthSession();
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <BackgroundPaths
          title="Private by default"
          subtitle="Connect securely, detect upcoming charges, and stay in control before subscriptions renew."
          ctaLabel="Back to home"
          ctaHref="/"
        />
        <div className="mx-auto w-full max-w-lg">
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
