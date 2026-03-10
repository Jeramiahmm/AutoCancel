import { addDays, subDays } from "date-fns";
import { prisma } from "@/src/server/db";
import { createOrMergeTrial } from "@/src/server/services/trial-service";
import { isDemoModeEnabled } from "@/src/lib/env";

export const DEMO_EMAIL = "demo@autocancel.app";

const demoTrialBlueprints = [
  {
    serviceName: "Notion AI",
    status: "ACTIVE" as const,
    startOffsetDays: -5,
    billingOffsetDays: 9,
    costAmount: 10,
    costCurrency: "USD",
    sourceProvider: "GOOGLE" as const,
    confidenceScore: 0.95,
  },
  {
    serviceName: "Adobe Creative Cloud",
    status: "ACTIVE" as const,
    startOffsetDays: -11,
    billingOffsetDays: 18,
    costAmount: 54.99,
    costCurrency: "USD",
    sourceProvider: "MICROSOFT" as const,
    confidenceScore: 0.92,
  },
  {
    serviceName: "Superhuman",
    status: "BILLING_SOON" as const,
    startOffsetDays: -27,
    billingOffsetDays: 2,
    costAmount: 30,
    costCurrency: "USD",
    sourceProvider: "GOOGLE" as const,
    confidenceScore: 0.89,
  },
  {
    serviceName: "Miro Business",
    status: "BILLING_SOON" as const,
    startOffsetDays: -12,
    billingOffsetDays: 1,
    costAmount: 16,
    costCurrency: "USD",
    sourceProvider: "MICROSOFT" as const,
    confidenceScore: 0.83,
  },
  {
    serviceName: "Duolingo Super",
    status: "CANCELLED" as const,
    startOffsetDays: -40,
    billingOffsetDays: -5,
    costAmount: 12.99,
    costCurrency: "USD",
    sourceProvider: "GOOGLE" as const,
    confidenceScore: 0.87,
  },
  {
    serviceName: "MasterClass",
    status: "CANCELLED" as const,
    startOffsetDays: -62,
    billingOffsetDays: -11,
    costAmount: 15,
    costCurrency: "USD",
    sourceProvider: "IMAP" as const,
    confidenceScore: 0.84,
  },
  {
    serviceName: "Linear",
    status: "COMPLETED" as const,
    startOffsetDays: -90,
    billingOffsetDays: -37,
    costAmount: 14,
    costCurrency: "USD",
    sourceProvider: "GOOGLE" as const,
    confidenceScore: 0.86,
  },
  {
    serviceName: "Canva Pro",
    status: "COMPLETED" as const,
    startOffsetDays: -104,
    billingOffsetDays: -64,
    costAmount: 12.99,
    costCurrency: "USD",
    sourceProvider: "MICROSOFT" as const,
    confidenceScore: 0.9,
  },
];

const demoReviewQueue = [
  {
    subject: "Your Figma trial ends in 3 days",
    sender: "billing@figma.com",
    snippet: "Your team trial is ending and billing begins on Friday.",
    extractionJson: {
      serviceName: "Figma",
      trialLengthDays: 14,
      startDate: subDays(new Date(), 11).toISOString(),
      billingDate: addDays(new Date(), 3).toISOString(),
      subscriptionCost: 15,
      currency: "USD",
      subscriptionType: "monthly",
      confidence: 0.62,
      evidence: ["trial ends", "billing begins"],
    },
    confidence: 0.64,
    provider: "GOOGLE" as const,
    messageId: "demo-figma-01",
  },
  {
    subject: "Grammarly premium renewal notice",
    sender: "notifications@grammarly.com",
    snippet: "Your free trial converts to Premium on March 15.",
    extractionJson: {
      serviceName: "Grammarly",
      trialLengthDays: null,
      startDate: null,
      billingDate: addDays(new Date(), 5).toISOString(),
      subscriptionCost: 12,
      currency: "USD",
      subscriptionType: "monthly",
      confidence: 0.58,
      evidence: ["renewal", "converts to premium"],
    },
    confidence: 0.59,
    provider: "MICROSOFT" as const,
    messageId: "demo-grammarly-01",
  },
  {
    subject: "Dropbox trial status update",
    sender: "hello@dropbox.com",
    snippet: "Action required before your trial period expires.",
    extractionJson: {
      serviceName: "Dropbox",
      trialLengthDays: 30,
      startDate: subDays(new Date(), 26).toISOString(),
      billingDate: addDays(new Date(), 4).toISOString(),
      subscriptionCost: 19.99,
      currency: "USD",
      subscriptionType: "monthly",
      confidence: 0.55,
      evidence: ["trial period", "expires"],
    },
    confidence: 0.57,
    provider: "IMAP" as const,
    messageId: "demo-dropbox-01",
  },
];

const syncSuggestions = [
  {
    serviceName: "Perplexity Pro",
    subject: "Perplexity Pro trial now active",
    cost: 20,
  },
  {
    serviceName: "Raycast Pro",
    subject: "Your Raycast trial ends soon",
    cost: 8,
  },
  {
    serviceName: "Calm Premium",
    subject: "Calm trial reminder",
    cost: 14.99,
  },
];

export async function ensureDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      isDemo: true,
      timezone: "America/Denver",
    },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      timezone: "America/Denver",
      tier: "FREE",
      isDemo: true,
    },
  });

  const existingTrials = await prisma.trial.count({ where: { userId: user.id } });
  if (existingTrials === 0) {
    await resetDemoData(user.id);
  }

  return user;
}

export async function assertDemoUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isDemo: true } });
  if (!user?.isDemo) {
    throw new Error("Demo-only endpoint");
  }
}

export async function resetDemoData(userId: string) {
  await assertDemoUser(userId);

  await prisma.notification.deleteMany({ where: { trial: { userId } } });
  await prisma.reminderJob.deleteMany({ where: { trial: { userId } } });
  await prisma.trialEvent.deleteMany({ where: { trial: { userId } } });
  await prisma.trial.deleteMany({ where: { userId } });
  await prisma.detectionCandidate.deleteMany({ where: { userId } });
  await prisma.syncedMessage.deleteMany({ where: { connection: { userId } } });
  await prisma.emailConnection.deleteMany({ where: { userId } });
  await prisma.notificationEndpoint.deleteMany({ where: { userId } });
  await prisma.billingSubscription.deleteMany({ where: { userId } });

  await prisma.user.update({
    where: { id: userId },
    data: {
      tier: "PREMIUM",
      isDemo: true,
      stripeCustomerId: null,
    },
  });

  const now = new Date();

  for (const trial of demoTrialBlueprints) {
    await createOrMergeTrial({
      userId,
      serviceName: trial.serviceName,
      startDate: addDays(now, trial.startOffsetDays),
      billingDate: addDays(now, trial.billingOffsetDays),
      costAmount: trial.costAmount,
      costCurrency: trial.costCurrency,
      sourceProvider: trial.sourceProvider,
      confidenceScore: trial.confidenceScore,
      metadata: {
        seeded: true,
        seededStatus: trial.status,
      },
    });
  }

  for (const trial of demoTrialBlueprints) {
    await prisma.trial.updateMany({
      where: { userId, serviceName: trial.serviceName },
      data: { status: trial.status },
    });
  }

  await prisma.emailConnection.createMany({
    data: [
      {
        userId,
        provider: "GOOGLE",
        emailAddress: DEMO_EMAIL,
        encryptedAccessToken: "demo-token",
        encryptedRefreshToken: null,
        scopes: ["gmail.readonly"],
        status: "CONNECTED",
      },
      {
        userId,
        provider: "MICROSOFT",
        emailAddress: DEMO_EMAIL,
        encryptedAccessToken: "demo-token",
        encryptedRefreshToken: null,
        scopes: ["mail.read"],
        status: "CONNECTED",
      },
    ],
  });

  await prisma.detectionCandidate.createMany({
    data: demoReviewQueue.map((item) => ({
      userId,
      provider: item.provider,
      messageId: item.messageId,
      sender: item.sender,
      subject: item.subject,
      snippet: item.snippet,
      extractionJson: item.extractionJson,
      confidence: item.confidence,
      reviewStatus: "PENDING",
    })),
  });

  await prisma.user.update({
    where: { id: userId },
    data: { tier: "FREE" },
  });

  return {
    seeded: true,
    trials: demoTrialBlueprints.length,
    reviewQueue: demoReviewQueue.length,
  };
}

export async function simulateDemoSync(userId: string) {
  await assertDemoUser(userId);

  const existing = await prisma.detectionCandidate.count({ where: { userId } });
  const pick = syncSuggestions[existing % syncSuggestions.length];

  await prisma.detectionCandidate.create({
    data: {
      userId,
      provider: "GOOGLE",
      messageId: `demo-sync-${Date.now()}`,
      sender: "updates@autocancel.demo",
      subject: pick.subject,
      snippet: `New subscription activity detected for ${pick.serviceName}.`,
      extractionJson: {
        serviceName: pick.serviceName,
        trialLengthDays: 14,
        startDate: new Date().toISOString(),
        billingDate: addDays(new Date(), 6).toISOString(),
        subscriptionCost: pick.cost,
        currency: "USD",
        subscriptionType: "monthly",
        confidence: 0.61,
        evidence: ["simulated demo sync"],
      },
      confidence: 0.61,
      reviewStatus: "PENDING",
    },
  });

  return {
    scanned: 18,
    detected: 1,
    autoAdded: 0,
    connections: 2,
    simulated: true,
  };
}

export async function toggleDemoTier(userId: string) {
  await assertDemoUser(userId);

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tier: true } });
  const nextTier = user?.tier === "PREMIUM" ? "FREE" : "PREMIUM";

  await prisma.user.update({
    where: { id: userId },
    data: { tier: nextTier },
  });

  return { tier: nextTier };
}

export function isDemoLoginEnabled() {
  return isDemoModeEnabled();
}
