import { z } from "zod";

export const TrialStatusSchema = z.enum([
  "ACTIVE",
  "BILLING_SOON",
  "CANCELLED",
  "COMPLETED",
]);
export type TrialStatus = z.infer<typeof TrialStatusSchema>;

export const SubscriptionTierSchema = z.enum(["FREE", "PREMIUM"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTierSchema>;

export const ReminderOffsetSchema = z.enum(["HOURS_48", "HOURS_24"]);
export type ReminderOffset = z.infer<typeof ReminderOffsetSchema>;

export const DetectionConfidenceSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export type DetectionConfidence = z.infer<typeof DetectionConfidenceSchema>;

export const ProviderTypeSchema = z.enum(["GOOGLE", "MICROSOFT", "IMAP"]);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

export const NotificationChannelSchema = z.enum(["EMAIL", "WEB_PUSH", "MOBILE_PUSH"]);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const TrialPatchInputSchema = z.object({
  status: TrialStatusSchema.optional(),
  billingDate: z.coerce.date().optional(),
  costAmount: z.number().nonnegative().nullable().optional(),
  costCurrency: z.string().length(3).nullable().optional(),
});
export type TrialPatchInput = z.infer<typeof TrialPatchInputSchema>;

export const TrialExtractionSchema = z.object({
  serviceName: z.string().min(1),
  trialLengthDays: z.number().int().positive().nullable(),
  startDate: z.string().datetime().nullable(),
  billingDate: z.string().datetime().nullable(),
  subscriptionCost: z.number().nonnegative().nullable(),
  currency: z.string().length(3).nullable(),
  subscriptionType: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()).default([]),
});
export type TrialExtraction = z.infer<typeof TrialExtractionSchema>;

export const WebPushSubscriptionInputSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const MobilePushTokenInputSchema = z.object({
  token: z.string().min(10),
  platform: z.enum(["IOS", "ANDROID"]),
  deviceLabel: z.string().optional(),
});

export const DetectionReviewInputSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export const IntegrationConnectInputSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url(),
  codeVerifier: z.string().optional(),
});

export const ImapConnectInputSchema = z.object({
  email: z.string().email(),
  host: z.string().min(1),
  port: z.number().int().positive(),
  secure: z.boolean().default(true),
  accessToken: z.string().min(20),
  refreshToken: z.string().min(20).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const TrialCardSchema = z.object({
  id: z.string(),
  serviceName: z.string(),
  startDate: z.string(),
  billingDate: z.string(),
  status: TrialStatusSchema,
  costAmount: z.number().nullable(),
  costCurrency: z.string().nullable(),
  daysRemaining: z.number().int(),
});
export type TrialCard = z.infer<typeof TrialCardSchema>;
