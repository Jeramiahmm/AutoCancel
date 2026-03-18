# AutoCancel

AutoCancel detects free trials and subscription billing emails, predicts upcoming charges, and sends 48h/24h reminders so users can cancel before being billed.

## Monorepo structure

- `apps/web`: Next.js web product (marketing pages, dashboard, API routes, auth, billing, cron)
- `apps/mobile`: Expo native companion for iOS/Android push registration
- `packages/shared`: Shared enums and zod contracts
- `docs`: Deployment and security docs

## Core features

- Production-ready auth with Google OAuth and optional email magic link
- Gmail, Outlook, and OAuth2 IMAP integration routes
- Trial detection pipeline (keyword heuristics + OpenAI structured extraction)
- Review queue for low-confidence detections
- Dashboard sections: Active Trials, Billing Soon, Cancelled, Completed
- Reminder automation (email + web push + mobile push)
- Stripe checkout, portal, and webhook billing state sync
- Free tier limit (3 active trials) and premium unlimited tracking
- Vercel cron endpoints for reminder processing and inbox sync refresh

## Local setup

1. Install dependencies

```bash
pnpm install
```

2. Start Postgres

```bash
docker compose up -d
```

3. Configure environment

```bash
cp .env.example .env
```

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

## Important environment variables

- Auth: `NEXTAUTH_URL`/`AUTH_URL`, `NEXTAUTH_SECRET`/`AUTH_SECRET`, Google OAuth keys, optional SMTP keys
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
- Billing:
  - `POST /api/billing/checkout`
  - `POST /api/billing/portal`
  - `POST /api/webhooks/stripe`
- User settings:
  - `GET /api/user/settings`
  - `PATCH /api/user/settings`
- Cron:
  - `POST /api/cron/reminders`
  - `POST /api/cron/inbox-sync`

## Tests and build

```bash
pnpm --filter @autocancel/shared test
pnpm --filter @autocancel/web lint
pnpm --filter @autocancel/web typecheck
pnpm --filter @autocancel/web test
pnpm --filter @autocancel/web build
```

## Deployment

Start with [docs/launch-checklist.md](docs/launch-checklist.md) for a beginner-friendly production launch path, then use:

- [docs/deployment.md](docs/deployment.md)
- [docs/auth-verification.md](docs/auth-verification.md)
- [docs/security.md](docs/security.md)
