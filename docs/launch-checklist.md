# AutoCancel Launch Checklist (Beginner-Friendly)

This is the fastest path to launch AutoCancel as a real production app.

## What I already handled in code

- Premium multi-page web UI and dashboard polish
- Production-safe auth error handling
- Google OAuth flow wiring (`/api/auth/callback/google`)
- Vercel cron endpoints for reminders/inbox sync
- Prisma schema and API routes for real data

## What you still need to do manually (external accounts)

These steps cannot be done from code because they happen in your own Vercel, Neon, and Google accounts.

## Step 1: Create a clean Vercel project

1. Go to Vercel and click `Add New` -> `Project`.
2. Import GitHub repo: `Jeramiahmm/AutoCancel`.
3. Set `Root Directory` to `apps/web`.
4. Set commands:
   - Install: `npm install`
   - Build: `npm run build`
5. Deploy.

## Step 2: Create Neon database

1. Create a Neon project.
2. Copy `DATABASE_URL` connection string.
3. In Vercel project -> `Settings` -> `Environment Variables`, add:
   - `DATABASE_URL=<your-neon-url>`

## Step 3: Add required auth environment variables

In Vercel -> Environment Variables (Production first), add:

- `NEXTAUTH_URL=https://your-domain.com`
- `NEXTAUTH_SECRET=<long-random-secret>`
- `AUTH_URL=https://your-domain.com` (optional alias)
- `AUTH_SECRET=<same-secret>` (optional alias)
- `DATABASE_URL=<your-neon-url>`

Generate a strong secret with:

```bash
openssl rand -base64 32
```

## Step 4: Configure Google OAuth

In Google Cloud Console:

1. Create OAuth Client (Web application).
2. Add Authorized JavaScript origin:
   - `https://your-domain.com`
3. Add Authorized redirect URI:
   - `https://your-domain.com/api/auth/callback/google`

Then add these env vars in Vercel:

- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`

## Step 5: Run database migrations to production DB

From your terminal:

```bash
cd /Users/jeramiahmendoza/Documents/Playground/apps/web
DATABASE_URL="<your-neon-url>" npx prisma migrate deploy
```

## Step 6: Add domain

1. In Vercel project -> `Domains`, add your domain.
2. Update DNS as Vercel asks.
3. Ensure `NEXTAUTH_URL` exactly matches your final domain (https).
4. Redeploy once.

## Step 7: Enable cron jobs in Vercel

In Vercel project settings, confirm these cron paths exist:

- `/api/cron/reminders`
- `/api/cron/inbox-sync`

Set `CRON_SECRET` env var too:

- `CRON_SECRET=<long-random-secret>`

## Step 8: Launch smoke test

Open your domain and verify:

1. Landing page loads new premium UI.
2. Click `Connect your email` -> goes to `/auth/signin`.
3. Click Google sign-in -> completes and lands on `/dashboard`.
4. Dashboard `Sync inbox` button works.
5. `Sign out` returns to home.
6. No `/api/auth/error` server crash page.

## Optional production add-ons (do after launch)

- `OPENAI_API_KEY` for AI extraction
- `RESEND_API_KEY` for email reminders
- Stripe keys for premium billing
- `ENCRYPTION_KEY_BASE64` for hardened token encryption
- `SENTRY_DSN` for error monitoring

