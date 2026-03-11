import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const boolFromString = z
  .preprocess(emptyToUndefined, z.union([z.boolean(), z.string()]).optional())
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

  NEXTAUTH_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXTAUTH_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().default("demo-only-insecure-secret-change-me-123456789"),
  ),
  DATABASE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("postgresql://postgres:postgres@localhost:5432/autocancel"),
  ),
  APP_BASE_URL: z.preprocess(emptyToUndefined, z.string().url().default("http://localhost:3000")),

  GOOGLE_CLIENT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  GOOGLE_CLIENT_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  MICROSOFT_CLIENT_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  MICROSOFT_CLIENT_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),

  SMTP_HOST: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PORT: z.preprocess(emptyToUndefined, z.string().default("587")),
  SMTP_USER: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_FROM: z.preprocess(emptyToUndefined, z.string().email().optional()),

  ENCRYPTION_KEY_BASE64: z
    .preprocess(emptyToUndefined, z.string().default("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")),

  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),

  STRIPE_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  STRIPE_WEBHOOK_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  STRIPE_PRICE_PREMIUM_MONTHLY: z.preprocess(emptyToUndefined, z.string().optional()),

  VAPID_PUBLIC_KEY: z.preprocess(
    emptyToUndefined,
    z.string().default("BEl7dXAM8T0trfByNfCGdNf5QbS4X6ev7yy2z5PrMN5FvS9yQ6G6wY9lYfP4sYpD7ne8xvji-y-0Ka1VvXfPOuA"),
  ),
  VAPID_PRIVATE_KEY: z.preprocess(emptyToUndefined, z.string().default("demo-vapid-private-key")),
  VAPID_SUBJECT: z.preprocess(emptyToUndefined, z.string().default("mailto:demo@autocancel.app")),

  CRON_SECRET: z.preprocess(emptyToUndefined, z.string().default("demo-cron-secret")),
  EXPO_ACCESS_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().optional()),
});

function parseEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (parsed.success) {
    return parsed.data;
  }

  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
  console.error(`Invalid environment configuration. Falling back to safe defaults. ${issues}`);
  return envSchema.parse({});
}

export const env = parseEnv();

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
