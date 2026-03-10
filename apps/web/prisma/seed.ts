import { PrismaClient, TrialStatus } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@autocancel.app" },
    update: {},
    create: {
      email: "demo@autocancel.app",
      timezone: "America/Denver",
      name: "Demo User",
    },
  });

  const base = new Date();
  const trials = [
    {
      serviceName: "Netflix",
      normalizedServiceKey: "netflix",
      billingDate: addDays(base, 2),
      startDate: subDays(base, 5),
      status: TrialStatus.BILLING_SOON,
      sourceProvider: "GOOGLE" as const,
      confidenceScore: 0.94,
      costAmount: 15.49,
      costCurrency: "USD",
    },
    {
      serviceName: "Canva Pro",
      normalizedServiceKey: "canva-pro",
      billingDate: addDays(base, 8),
      startDate: subDays(base, 6),
      status: TrialStatus.ACTIVE,
      sourceProvider: "MICROSOFT" as const,
      confidenceScore: 0.9,
      costAmount: 12.99,
      costCurrency: "USD",
    },
  ];

  for (const trial of trials) {
    await prisma.trial.upsert({
      where: {
        userId_normalizedServiceKey_billingDate: {
          userId: user.id,
          normalizedServiceKey: trial.normalizedServiceKey,
          billingDate: trial.billingDate,
        },
      },
      update: trial,
      create: {
        userId: user.id,
        ...trial,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
