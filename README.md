# AutoCancel

AutoCancel detects free trials and subscription billing emails, predicts upcoming charges, and sends 48h/24h reminders so users can cancel before being billed.

## Monorepo structure

- `apps/web`: Next.js web product (landing page, dashboard, API, auth, billing, cron)
- `apps/mobile`: Expo native companion for iOS/Android push registration
- `packages/shared`: Shared enums and zod contracts
- `docs`: Deployment and security docs

## Core features implemented

- Fully seeded Demo Mode with instant sign-in, demo banner, reset button, and simulated provider/billing flows
- Email auth (magic link) + Google auth via NextAuth
- Gmail, Outlook, and OAuth2 IMAP integration routes
- Detection pipeline (keywords + OpenAI structured extraction)
- Auto-approve high-confidence detections, review queue for uncertain detections
- Dashboard sections: Active Trials, Billing Soon, Cancelled, Completed
- Trial status updates and restore
- Reminder jobs (email + web push + native push)
- Stripe Checkout + customer portal + webhook processing
- Free tier limits (3 active) and premium unlimited
- Vercel cron endpoints for reminder processing and periodic inbox sync

## Local setup

1. Install dependencies

```bash
pnpm install
```

2. Start Postgres

```bash
docker compose up -d
```

3. Configure env vars

```bash
cp .env.example .env
```

For keyless demo, keep `DEMO_MODE=true` and leave external provider keys empty.

4. Prisma setup

```bash
pnpm --filter @autocancel/web prisma:generate
pnpm --filter @autocancel/web prisma:migrate
pnpm --filter @autocancel/web prisma:seed
```

5. Start web app

```bash
pnpm dev:web
```

6. Start mobile app (optional)

```bash
pnpm dev:mobile
```

## Demo mode

- Open `/` and click `Try Demo` for instant sign-in.
- Demo Mode seeds realistic sample data for:
  - active trials
  - billing soon
  - cancelled trials
  - completed trials
  - review queue items
  - premium upsell state
- Use `Reset demo data` in the dashboard to restore seeded state with one click.
- In demo mode, inbox sync/provider connect/upgrade actions are simulated so the full UX is clickable without external APIs.

## Important environment variables

- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, SMTP credentials, Google/Microsoft OAuth keys
- Data: `DATABASE_URL`, `ENCRYPTION_KEY_BASE64`
- AI + notifications: `OPENAI_API_KEY`, `RESEND_API_KEY`, `VAPID_*`, `EXPO_ACCESS_TOKEN`
- Billing: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PREMIUM_MONTHLY`, `STRIPE_WEBHOOK_SECRET`
- Jobs: `CRON_SECRET`

## API surface

- Integrations:
  - `POST /api/integrations/google/connect|disconnect|sync`
  - `POST /api/integrations/microsoft/connect|disconnect|sync`
  - `POST /api/integrations/imap/connect|disconnect|sync`
- Trials:
  - `GET /api/trials?status=active|billing-soon|cancelled|completed`
  - `PATCH /api/trials/:id`
  - `POST /api/trials/:id/restore`
  - `GET /api/trials/history`
- Detection queue:
  - `GET /api/detections/pending`
  - `POST /api/detections/:id/approve|reject`
- Notifications:
  - `POST /api/notifications/subscribe/web-push`
  - `POST /api/mobile/push-token`
  - `POST /api/mobile/link-token`
- Demo:
  - `POST /api/demo/reset`
  - `POST /api/demo/toggle-tier`
  - `POST /api/demo/connect`
- Billing:
  - `POST /api/billing/checkout`
  - `POST /api/billing/portal`
  - `POST /api/webhooks/stripe`
- Cron:
  - `POST /api/cron/reminders`
  - `POST /api/cron/inbox-sync`

## Running tests

```bash
pnpm --filter @autocancel/shared test
pnpm --filter @autocancel/web test
pnpm --filter @autocancel/web test:e2e
```

## Deployment

See [docs/deployment.md](docs/deployment.md) and [docs/security.md](docs/security.md).
