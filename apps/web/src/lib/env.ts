import { z } from "zod";

const boolFromString = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      return ["1", "true", "yes", "on"].includes(value.toLowerCase());
    }

    return undefined;
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DEMO_MODE: boolFromString.default(true),

  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().default("demo-only-insecure-secret-change-me-123456789"),
  DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/autocancel"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  ENCRYPTION_KEY_BASE64: z
    .string()
    .default("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY="),

  OPENAI_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PREMIUM_MONTHLY: z.string().optional(),

  VAPID_PUBLIC_KEY: z.string().default("BEl7dXAM8T0trfByNfCGdNf5QbS4X6ev7yy2z5PrMN5FvS9yQ6G6wY9lYfP4sYpD7ne8xvji-y-0Ka1VvXfPOuA"),
  VAPID_PRIVATE_KEY: z.string().default("demo-vapid-private-key"),
  VAPID_SUBJECT: z.string().default("mailto:demo@autocancel.app"),

  CRON_SECRET: z.string().default("demo-cron-secret"),
  EXPO_ACCESS_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export function hasGoogleOAuth() {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function hasMicrosoftOAuth() {
  return Boolean(env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET);
}

export function hasEmailMagicLink() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM);
}

export function hasOpenAi() {
  return Boolean(env.OPENAI_API_KEY);
}

export function hasStripe() {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_PREMIUM_MONTHLY);
}

export function hasResend() {
  return Boolean(env.RESEND_API_KEY);
}

export function isDemoModeEnabled() {
  return env.DEMO_MODE;
}
