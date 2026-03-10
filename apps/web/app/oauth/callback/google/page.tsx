import { redirect } from "next/navigation";
import { requireAuth } from "@/src/lib/auth-guard";
import { env } from "@/src/lib/env";
import { connectProvider } from "@/src/server/services/integration-service";

export default async function GoogleCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const session = await requireAuth();
  const params = await searchParams;

  if (params.error) {
    redirect(`/dashboard?connect_error=${encodeURIComponent(params.error)}`);
  }

  if (!params.code) {
    redirect("/dashboard?connect_error=missing_code");
  }

  await connectProvider("GOOGLE", {
    userId: session.user.id,
    code: params.code,
    redirectUri: `${env.APP_BASE_URL}/oauth/callback/google`,
  });

  redirect("/dashboard?connected=google");
}
