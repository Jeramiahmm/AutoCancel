import { subDays } from "date-fns";
import { prisma } from "@/src/server/db";
import { fetchGoogleTrialEmails } from "@/src/server/integrations/google";
import { fetchMicrosoftTrialEmails } from "@/src/server/integrations/microsoft";
import { fetchImapTrialEmails } from "@/src/server/integrations/imap";
import { parseTrialFromEmail } from "@/src/server/services/ai-parser";
import { scoreKeywordMatch } from "@/src/server/services/keyword-detector";
import { createOrMergeTrial } from "@/src/server/services/trial-service";
import { simulateDemoSync } from "@/src/server/services/demo-service";
import type { ProviderType } from "@prisma/client";

const AUTO_APPROVE_THRESHOLD = 0.78;

function getProviderFetcher(provider: ProviderType) {
  if (provider === "GOOGLE") {
    return fetchGoogleTrialEmails;
  }

  if (provider === "MICROSOFT") {
    return fetchMicrosoftTrialEmails;
  }

  return fetchImapTrialEmails;
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(1, value));
}

export async function syncInboxForUser(userId: string, provider?: ProviderType) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isDemo: true },
  });

  if (user?.isDemo) {
    return simulateDemoSync(userId);
  }

  const connections = await prisma.emailConnection.findMany({
    where: {
      userId,
      status: "CONNECTED",
      ...(provider ? { provider } : {}),
    },
  });

  let scanned = 0;
  let detected = 0;
  let autoAdded = 0;

  for (const connection of connections) {
    const fetcher = getProviderFetcher(connection.provider);
    const messages = await fetcher(connection, subDays(new Date(), 180));

    for (const message of messages) {
      scanned += 1;

      const existingMessage = await prisma.syncedMessage.findUnique({
        where: {
          connectionId_externalId: {
            connectionId: connection.id,
            externalId: message.messageId,
          },
        },
      });

      if (existingMessage) {
        continue;
      }

      await prisma.syncedMessage.create({
        data: {
          connectionId: connection.id,
          externalId: message.messageId,
          threadId: message.threadId,
          internalDate: message.internalDate,
        },
      });

      const extraction = await parseTrialFromEmail(message.subject, message.body);
      const heuristicScore = scoreKeywordMatch(message.subject, message.body);
      const confidence = clampConfidence(0.4 * extraction.confidence + 0.6 * heuristicScore);

      detected += 1;

      const candidate = await prisma.detectionCandidate.upsert({
        where: {
          userId_provider_messageId: {
            userId,
            provider: connection.provider,
            messageId: message.messageId,
          },
        },
        update: {
          subject: message.subject,
          sender: message.from,
          snippet: message.snippet,
          extractionJson: extraction,
          confidence,
        },
        create: {
          userId,
          provider: connection.provider,
          messageId: message.messageId,
          sender: message.from,
          subject: message.subject,
          snippet: message.snippet,
          extractionJson: extraction,
          confidence,
        },
      });

      if (confidence >= AUTO_APPROVE_THRESHOLD) {
        await createOrMergeTrial({
          userId,
          serviceName: extraction.serviceName,
          startDate: extraction.startDate ? new Date(extraction.startDate) : null,
          billingDate: extraction.billingDate ? new Date(extraction.billingDate) : null,
          costAmount: extraction.subscriptionCost,
          costCurrency: extraction.currency,
          sourceProvider: connection.provider,
          confidenceScore: confidence,
          metadata: {
            candidateId: candidate.id,
            providerMessageId: message.messageId,
            evidence: extraction.evidence,
          },
        });

        await prisma.detectionCandidate.update({
          where: { id: candidate.id },
          data: { reviewStatus: "APPROVED", reviewedAt: new Date() },
        });

        autoAdded += 1;
      }
    }
  }

  return {
    scanned,
    detected,
    autoAdded,
    connections: connections.length,
  };
}

export async function listPendingDetections(userId: string) {
  return prisma.detectionCandidate.findMany({
    where: {
      userId,
      reviewStatus: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function reviewDetection(userId: string, detectionId: string, action: "approve" | "reject") {
  const detection = await prisma.detectionCandidate.findFirst({
    where: {
      id: detectionId,
      userId,
    },
  });

  if (!detection) {
    throw new Error("Detection not found");
  }

  if (action === "reject") {
    return prisma.detectionCandidate.update({
      where: { id: detectionId },
      data: { reviewStatus: "REJECTED", reviewedAt: new Date() },
    });
  }

  const extraction = detection.extractionJson as {
    serviceName?: string;
    startDate?: string | null;
    billingDate?: string | null;
    subscriptionCost?: number | null;
    currency?: string | null;
  };

  await createOrMergeTrial({
    userId,
    serviceName: extraction.serviceName ?? "Unknown service",
    startDate: extraction.startDate ? new Date(extraction.startDate) : null,
    billingDate: extraction.billingDate ? new Date(extraction.billingDate) : null,
    costAmount: extraction.subscriptionCost ?? null,
    costCurrency: extraction.currency ?? null,
    sourceProvider: detection.provider,
    confidenceScore: detection.confidence,
    metadata: {
      candidateId: detection.id,
      reviewAction: "manual-approve",
    },
  });

  return prisma.detectionCandidate.update({
    where: { id: detectionId },
    data: {
      reviewStatus: "APPROVED",
      reviewedAt: new Date(),
    },
  });
}
