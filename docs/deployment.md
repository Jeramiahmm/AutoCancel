# Deployment Guide (Vercel + Neon + Expo)

## 1. Provision services
- PostgreSQL: Neon project (copy pooled DATABASE_URL).
- Stripe: create monthly product price, keep `price_...` id.
- OpenAI, Resend, Google Cloud OAuth app, Microsoft Entra app.
- Generate web push VAPID keys.

## 2. Configure OAuth
- Google redirect URIs:
  - `https://<your-domain>/api/auth/callback/google`
  - `https://<your-domain>/oauth/callback/google`
- Microsoft redirect URI:
  - `https://<your-domain>/oauth/callback/microsoft`

## 3. Vercel project
- Root directory: `apps/web`
- Build command: `pnpm build`
- Install command: `pnpm install`
- Add all env vars from `.env.example`.
- Production auth requires:
  - `NEXTAUTH_URL` (or `AUTH_URL`)
  - `APP_BASE_URL` (recommended for OAuth provider-connect callback URLs)
  - `NEXTAUTH_SECRET` (or `AUTH_SECRET`)
  - `DATABASE_URL`
  - At least one auth provider:
    - Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
    - or magic link SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- Add `CRON_SECRET` in Vercel env so cron requests include authorization.

### Branch and environment behavior
- `main` branch -> Production deployment.
- Feature branches/PRs -> Preview deployments.
- Set auth env vars in all three scopes in Vercel:
  - Production
  - Preview
  - Development

Without preview env vars, auth buttons may route to `/auth/error` by design.

## 4. Stripe webhook
- Create webhook endpoint:
  - `https://<your-domain>/api/webhooks/stripe`
- Subscribe to:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

## 5. Cron jobs
`apps/web/vercel.json` schedules:
- reminders hourly
- inbox sync every 6 hours

## 6. Mobile (Expo)
- From repo root: `pnpm --filter @autocancel/mobile start`
- Build with EAS once app identifiers and assets are configured.
- Expo app registers push token via web-generated mobile link token.

## 7. Google OAuth exact setup
In Google Cloud Console OAuth client:
- Authorized JavaScript origins:
  - `https://<your-domain>`
  - `https://<preview-domain>.vercel.app` (optional for preview testing)
- Authorized redirect URIs:
  - `https://<your-domain>/api/auth/callback/google`
  - `https://<your-domain>/oauth/callback/google`
  - preview equivalents if preview auth is required
