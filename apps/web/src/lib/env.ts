import { z } from "zod";

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/autocancel";
const defaultBaseUrl = "http://localhost:3000";
const developmentFallbackSecret = "dev-only-auth-secret-change-me";

const inferredBaseUrl =
  process.env.NEXTAUTH_URL ||
  process.env.AUTH_URL ||
  process.env.APP_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : defaultBaseUrl);

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  AUTH_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXTAUTH_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  AUTH_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXTAUTH_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  APP_BASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),

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
  VAPID_PRIVATE_KEY: z.preprocess(emptyToUndefined, z.string().default("dev-vapid-private-key")),
  VAPID_SUBJECT: z.preprocess(emptyToUndefined, z.string().default("mailto:alerts@autocancel.app")),

  CRON_SECRET: z.preprocess(emptyToUndefined, z.string().default("dev-cron-secret-change-me")),
  EXPO_ACCESS_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().optional()),
});

function parseEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (parsed.success) {
    return parsed.data;
  }

  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
  console.error(`[env] Invalid environment variables detected: ${issues}`);
  return envSchema.parse({});
}

const rawEnv = parseEnv();
const resolvedBaseUrl = rawEnv.NEXTAUTH_URL ?? rawEnv.AUTH_URL ?? rawEnv.APP_BASE_URL ?? inferredBaseUrl;
const isProd = rawEnv.NODE_ENV === "production";
const resolvedSecret =
  rawEnv.NEXTAUTH_SECRET ??
  rawEnv.AUTH_SECRET ??
  (isProd ? undefined : developmentFallbackSecret);

export const env = {
  ...rawEnv,
  NEXTAUTH_URL: rawEnv.NEXTAUTH_URL ?? resolvedBaseUrl,
  APP_BASE_URL: rawEnv.APP_BASE_URL ?? resolvedBaseUrl,
  DATABASE_URL: rawEnv.DATABASE_URL ?? defaultDatabaseUrl,
  NEXTAUTH_SECRET: resolvedSecret,
};

export function getProductionAuthIssues() {
  if (!isProd) {
    return [] as string[];
  }

  const issues: string[] = [];

  if (!process.env.NEXTAUTH_URL && !process.env.AUTH_URL && !process.env.APP_BASE_URL) {
    issues.push("Missing NEXTAUTH_URL (or AUTH_URL/APP_BASE_URL).");
  }

  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    issues.push("Missing NEXTAUTH_SECRET (or AUTH_SECRET).");
  }

  if (!process.env.DATABASE_URL) {
    issues.push("Missing DATABASE_URL.");
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    issues.push("Google OAuth is not configured (missing GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET).");
  }

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD ||
    !process.env.SMTP_FROM
  ) {
    issues.push("Email magic link is not configured (missing SMTP settings).");
  }

  return issues;
}

export function getProductionCriticalAuthIssues() {
  if (!isProd) {
    return [] as string[];
  }

  const issues: string[] = [];

  if (!process.env.NEXTAUTH_URL && !process.env.AUTH_URL && !process.env.APP_BASE_URL) {
    issues.push("Missing NEXTAUTH_URL (or AUTH_URL/APP_BASE_URL).");
  }

  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    issues.push("Missing NEXTAUTH_SECRET (or AUTH_SECRET).");
  }

  if (!process.env.DATABASE_URL) {
    issues.push("Missing DATABASE_URL.");
  }

  const hasGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);
  const hasMagicLink =
    Boolean(process.env.SMTP_HOST) &&
    Boolean(process.env.SMTP_USER) &&
    Boolean(process.env.SMTP_PASSWORD) &&
    Boolean(process.env.SMTP_FROM);

  if (!hasGoogle && !hasMagicLink) {
    issues.push("No authentication provider configured. Configure Google OAuth and/or SMTP magic links.");
  }

  return issues;
}

export function isProductionAuthReady() {
  return getProductionCriticalAuthIssues().length === 0;
}

const warnOnceKey = "__autocancelAuthConfigWarned";
const warnStore = globalThis as typeof globalThis & { [warnOnceKey]?: boolean };
if (!warnStore[warnOnceKey]) {
  if (!isProd && !process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    console.warn("[auth.config] Using development fallback auth secret. Set NEXTAUTH_SECRET for shared environments.");
  }

  const productionIssues = getProductionCriticalAuthIssues();
  if (productionIssues.length > 0) {
    console.error(`[auth.config] Production auth configuration issues: ${productionIssues.join(" | ")}`);
  }

  warnStore[warnOnceKey] = true;
}

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

export function hasAnyAuthProvider() {
  return hasGoogleOAuth() || hasEmailMagicLink();
}
