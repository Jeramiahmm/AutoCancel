import { addDays } from "date-fns";
import { prisma } from "@/src/server/db";
import { scheduleReminderJobs } from "@/src/server/services/reminder-service";
import { getDaysRemaining, normalizeServiceName } from "@/src/server/services/time";
import type { Prisma } from "@prisma/client";
import type { TrialStatus } from "@prisma/client";
import type { TrialPatchInput } from "@/src/shared/contracts";

const FREE_PLAN_LIMIT = 3;

export async function assertCanCreateTrial(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { tier: true, isDemo: true } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.tier === "PREMIUM" || user.isDemo) {
    return;
  }

  const activeCount = await prisma.trial.count({
    where: {
      userId,
      status: { in: ["ACTIVE", "BILLING_SOON"] },
    },
  });

  if (activeCount >= FREE_PLAN_LIMIT) {
    throw new Error("Free plan limit reached. Upgrade to Premium for unlimited trials.");
  }
}

export async function createOrMergeTrial(input: {
  userId: string;
  serviceName: string;
  startDate?: Date | null;
  billingDate?: Date | null;
  costAmount?: number | null;
  costCurrency?: string | null;
  sourceProvider: "GOOGLE" | "MICROSOFT" | "IMAP";
  confidenceScore: number;
  metadata?: Record<string, unknown>;
}) {
  await assertCanCreateTrial(input.userId);

  const normalizedServiceKey = normalizeServiceName(input.serviceName);
  const billingDate = input.billingDate ?? addDays(new Date(), 7);

  const existing = await prisma.trial.findFirst({
    where: {
      userId: input.userId,
      normalizedServiceKey,
      billingDate: {
        gte: addDays(billingDate, -1),
        lte: addDays(billingDate, 1),
      },
    },
  });

  const status: TrialStatus = getDaysRemaining(billingDate) <= 2 ? "BILLING_SOON" : "ACTIVE";
  const mergedMetadata = {
    ...(existing?.metadata && typeof existing.metadata === "object"
      ? (existing.metadata as Record<string, unknown>)
      : {}),
    ...(input.metadata ?? {}),
  } as Prisma.InputJsonValue;

  const trial = existing
    ? await prisma.trial.update({
        where: { id: existing.id },
        data: {
          serviceName: input.serviceName,
          startDate: input.startDate,
          billingDate,
          costAmount: input.costAmount,
          costCurrency: input.costCurrency,
          status,
          sourceProvider: input.sourceProvider,
          confidenceScore: Math.max(existing.confidenceScore, input.confidenceScore),
          metadata: mergedMetadata,
        },
      })
    : await prisma.trial.create({
        data: {
          userId: input.userId,
          serviceName: input.serviceName,
          normalizedServiceKey,
          startDate: input.startDate,
          billingDate,
          costAmount: input.costAmount,
          costCurrency: input.costCurrency,
          status,
          sourceProvider: input.sourceProvider,
          confidenceScore: input.confidenceScore,
          metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
        },
      });

  await prisma.trialEvent.create({
    data: {
      trialId: trial.id,
      eventType: existing ? "trial_merged" : "trial_created",
      payload: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });

  await scheduleReminderJobs(trial.id);

  return trial;
}

export async function listTrials(userId: string, status?: string) {
  const where = {
    userId,
    ...(status
      ? {
          status:
            status === "billing-soon"
              ? "BILLING_SOON"
              : (status.toUpperCase().replace("-", "_") as TrialStatus),
        }
      : {}),
  };

  const trials = await prisma.trial.findMany({
    where,
    orderBy: [{ billingDate: "asc" }],
  });

  return trials.map((trial) => ({
    id: trial.id,
    serviceName: trial.serviceName,
    startDate: trial.startDate?.toISOString() ?? trial.createdAt.toISOString(),
    billingDate: trial.billingDate.toISOString(),
    status: trial.status,
    costAmount: trial.costAmount,
    costCurrency: trial.costCurrency,
    daysRemaining: getDaysRemaining(trial.billingDate),
  }));
}

export async function updateTrial(trialId: string, userId: string, input: TrialPatchInput) {
  const trial = await prisma.trial.findFirst({ where: { id: trialId, userId } });
  if (!trial) {
    throw new Error("Trial not found");
  }

  const updated = await prisma.trial.update({
    where: { id: trialId },
    data: {
      status: input.status as TrialStatus | undefined,
      billingDate: input.billingDate,
      costAmount: input.costAmount,
      costCurrency: input.costCurrency,
    },
  });

  await prisma.trialEvent.create({
    data: {
      trialId,
      eventType: "trial_updated",
      payload: input,
    },
  });

  if (input.billingDate) {
    await scheduleReminderJobs(trialId);
  }

  return updated;
}

export async function restoreTrial(trialId: string, userId: string) {
  const trial = await prisma.trial.findFirst({ where: { id: trialId, userId } });
  if (!trial) {
    throw new Error("Trial not found");
  }

  const status: TrialStatus = getDaysRemaining(trial.billingDate) <= 2 ? "BILLING_SOON" : "ACTIVE";
  return prisma.trial.update({
    where: { id: trialId },
    data: { status },
  });
}
