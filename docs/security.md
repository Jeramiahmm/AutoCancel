# Security Notes

## OAuth and credentials
- AutoCancel stores OAuth access/refresh tokens only; no email passwords.
- IMAP fallback is OAuth2 only (XOAUTH2).
- Tokens are encrypted using AES-256-GCM before persistence.

## Auth and session
- NextAuth database sessions + magic link and Google sign-in.
- Demo credentials provider can be enabled/disabled with `DEMO_MODE`.
- Protected APIs require authenticated session, except:
  - cron endpoints (Bearer `CRON_SECRET`)
  - mobile push token registration with short-lived JWT link token.

## Billing and webhooks
- Stripe webhook signatures are verified.
- Premium access is derived from Stripe events and stored per user.

## Recommendation checklist
- Rotate encryption key and OAuth secrets on schedule.
- Enable database backups and point-in-time restore.
- Add WAF/rate limiting for public endpoints.
- Add Sentry alerting for failed cron jobs.
