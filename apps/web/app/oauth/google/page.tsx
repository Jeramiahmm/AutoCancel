import { redirect } from "next/navigation";
import { env, hasGoogleOAuth } from "@/src/lib/env";

export default function GoogleOAuthStart() {
  if (!hasGoogleOAuth()) {
    redirect("/dashboard?connect_error=oauth_not_configured");
  }

  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    redirect("/dashboard?connect_error=oauth_client_missing");
  }

  const redirectUri = `${env.APP_BASE_URL}/oauth/callback/google`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope:
      "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    prompt: "consent",
  });

  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
