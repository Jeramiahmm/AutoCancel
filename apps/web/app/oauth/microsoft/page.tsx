import { redirect } from "next/navigation";
import { env, hasMicrosoftOAuth } from "@/src/lib/env";

export default function MicrosoftOAuthStart() {
  if (!hasMicrosoftOAuth()) {
    redirect("/dashboard?connect_error=microsoft_not_configured");
  }

  const redirectUri = `${env.APP_BASE_URL}/oauth/callback/microsoft`;
  const params = new URLSearchParams({
    client_id: env.MICROSOFT_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: "offline_access User.Read Mail.Read",
    prompt: "select_account",
  });

  redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`);
}
