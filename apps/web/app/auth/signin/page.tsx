import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth";
import { hasEmailMagicLink, hasGoogleOAuth, isDemoModeEnabled } from "@/src/lib/env";
import { SignInCard } from "@/components/marketing/sign-in-card";

export default async function SignInPage() {
  const session = await getAuthSession();
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-lg place-items-center px-4">
      <SignInCard
        emailEnabled={hasEmailMagicLink()}
        googleEnabled={hasGoogleOAuth()}
        demoEnabled={isDemoModeEnabled()}
      />
    </main>
  );
}
