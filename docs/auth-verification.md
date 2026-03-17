# Auth Verification Checklist (Local + Vercel)

Use this after each deploy to confirm sign-in is production-safe.

## 1) Required environment variables

Set these in Vercel for `Production`, `Preview`, and `Development`:

- `NEXTAUTH_URL` (or `AUTH_URL`)
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
- `APP_BASE_URL`
- `DATABASE_URL`

Google login additionally requires:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Optional:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` for email magic links

## 2) OAuth redirect URIs to register

Google Cloud Console:

- `<APP_BASE_URL>/api/auth/callback/google`
- `<APP_BASE_URL>/oauth/callback/google`

Microsoft Entra (if enabled):

- `<APP_BASE_URL>/oauth/callback/microsoft`

## 3) Smoke checks in browser

1. Open `/`
2. Click `Connect Email` -> should route to `/auth/signin`
3. Click `Log in` -> should route to `/auth/signin`
4. Complete Google sign-in -> should route to `/dashboard`
5. From dashboard click `Sign out` -> should route back to `/`

## 4) OAuth start checks

With OAuth configured:

- `/oauth/google` should redirect to Google consent page, then back to `/oauth/callback/google`

Without OAuth configured:

- `/oauth/google` should redirect to `/dashboard?connect_error=oauth_not_configured` (no 500 crash)

## 5) Route-level checks

```bash
# Replace with your deployed domain
BASE_URL="https://your-domain.vercel.app"

curl -I "$BASE_URL/"
curl -I "$BASE_URL/auth/signin"
curl -I "$BASE_URL/api/auth/session"
curl -I "$BASE_URL/oauth/google"
```

Expected:

- no `500` responses for the auth entry routes
- `oauth/google` is a redirect (`302` or `307`)

## 6) Auth error behavior checks

Trigger an OAuth callback without a code:

```bash
curl -I "$BASE_URL/oauth/callback/google"
```

Expected redirect to:

- `/dashboard?connect_error=missing_code`

## 7) Logs to inspect in Vercel

Watch project logs while running the above checks:

- `auth.error`
- `oauth.google.exchange_failed`
- `oauth.microsoft.exchange_failed`

No unhandled server exceptions should appear during sign-in attempts.
