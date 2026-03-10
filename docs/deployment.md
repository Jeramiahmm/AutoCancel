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
- Set `DEMO_MODE=false` in production if you want to disable instant demo login.
- Add `CRON_SECRET` in Vercel env so cron requests include authorization.

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
