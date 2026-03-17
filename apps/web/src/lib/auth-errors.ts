const authErrorMessages: Record<string, string> = {
  Configuration: "Authentication server configuration is invalid.",
  OAuthSignin: "OAuth sign-in could not be started.",
  OAuthCallback: "OAuth callback failed. Please try again.",
  AccessDenied: "Access was denied by the identity provider.",
  oauth_not_configured: "OAuth is not configured yet. Contact support or finish provider setup.",
  oauth_client_missing: "OAuth client credentials are missing.",
  oauth_callback_failed: "OAuth callback failed. Please try connecting again.",
  oauth_token_exchange_failed: "OAuth token exchange failed. Verify redirect URI settings in your provider console.",
  missing_code: "Provider callback is missing an authorization code.",
  access_denied: "Authorization was denied. Please retry and grant access.",
  auth_unavailable: "Authentication is temporarily unavailable.",
  unknown_error: "Something went wrong. Please try again.",
};

export function toAuthErrorCode(error: unknown, fallback = "unknown_error") {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.toLowerCase();
  if (message.includes("not configured")) {
    return "oauth_not_configured";
  }
  if (message.includes("client") && message.includes("missing")) {
    return "oauth_client_missing";
  }
  if (message.includes("missing_code")) {
    return "missing_code";
  }
  if (message.includes("access_denied")) {
    return "access_denied";
  }
  if (message.includes("token exchange failed")) {
    return "oauth_token_exchange_failed";
  }
  if (message.includes("oauth") || message.includes("callback")) {
    return "oauth_callback_failed";
  }

  return fallback;
}

export function getAuthErrorMessage(code?: string | null) {
  if (!code) {
    return null;
  }
  return authErrorMessages[code] ?? authErrorMessages.unknown_error;
}
