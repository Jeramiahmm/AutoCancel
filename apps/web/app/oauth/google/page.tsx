import { redirect } from "next/navigation";
import { env, hasGoogleOAuth } from "@/src/lib/env";

export default function GoogleOAuthStart() {
  if (!hasGoogleOAuth()) {
    redirect("/dashboard?connect_error=google_not_configured");
  }

  const redirectUri = `${env.APP_BASE_URL}/oauth/callback/google`;
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope:
      "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    prompt: "consent",
  });

  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
