import { addHours } from "date-fns";
import { Resend } from "resend";
import { prisma } from "@/src/server/db";
import { reminderDates } from "@/src/server/services/time";
import { sendMobilePush, sendWebPush } from "@/src/server/services/push-service";
import { env, hasResend } from "@/src/lib/env";
import { log } from "@/src/server/security/logger";

function getResend() {
  if (!hasResend() || !env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
}

export async function scheduleReminderJobs(trialId: string) {
  const trial = await prisma.trial.findUnique({ where: { id: trialId }, include: { user: true } });
  if (!trial) {
    return;
  }

  const dates = reminderDates(trial.billingDate);
  const channels: Array<"EMAIL" | "WEB_PUSH" | "MOBILE_PUSH"> = ["EMAIL", "WEB_PUSH", "MOBILE_PUSH"];

  for (const date of dates) {
    for (const channel of channels) {
      const idempotencyKey = `${trialId}:${channel}:${date.toISOString()}`;
      await prisma.reminderJob.upsert({
        where: { idempotencyKey },
        update: {},
        create: {
          trialId,
          channel,
          scheduledFor: date,
          idempotencyKey,
        },
      });
    }
  }
}

function reminderOffsetHours(reminderDate: Date, billingDate: Date) {
  const diff = Math.round((billingDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60));
  return diff;
}

async function sendReminderEmail(
  email: string,
  serviceName: string,
  billingDate: Date,
  offsetHours: number,
) {
  const resend = getResend();
  if (!resend) {
    log("info", "Skipping email reminder: Resend not configured", { email, serviceName });
    return;
  }

  await resend.emails.send({
    from: "AutoCancel <alerts@autocancel.app>",
    to: email,
    subject: `${serviceName} billing in ${offsetHours} hours`,
    html: `<div style="font-family:Inter,Arial,sans-serif;padding:20px">\n      <h2>${serviceName} charges soon</h2>\n      <p>Your trial is scheduled to bill on <strong>${billingDate.toDateString()}</strong>.</p>\n      <p>You are receiving this ${offsetHours}-hour reminder from AutoCancel.</p>\n    </div>`,
  });
}

export async function processDueReminders(now = new Date()) {
  const jobs = await prisma.reminderJob.findMany({
    where: {
      status: "PENDING",
      scheduledFor: { lte: now },
    },
    include: {
      trial: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      scheduledFor: "asc",
    },
    take: 100,
  });

  for (const job of jobs) {
    try {
      const offsetHours = reminderOffsetHours(job.scheduledFor, job.trial.billingDate);
      const payload = {
        title: `${job.trial.serviceName} charges soon`,
        body: `Billing date: ${job.trial.billingDate.toDateString()} (${offsetHours}h reminder)`,
      };

      if (job.channel === "EMAIL") {
        await sendReminderEmail(
          job.trial.user.email,
          job.trial.serviceName,
          job.trial.billingDate,
          offsetHours,
        );
      }

      if (job.channel === "WEB_PUSH") {
        const endpoints = await prisma.notificationEndpoint.findMany({
          where: { userId: job.trial.userId, channel: "WEB_PUSH" },
        });

        for (const endpoint of endpoints) {
          if (endpoint.auth && endpoint.p256dh) {
            await sendWebPush(
              { endpoint: endpoint.endpoint, auth: endpoint.auth, p256dh: endpoint.p256dh },
              payload,
            );
          }
        }
      }

      if (job.channel === "MOBILE_PUSH") {
        const endpoints = await prisma.notificationEndpoint.findMany({
          where: { userId: job.trial.userId, channel: "MOBILE_PUSH" },
        });

        await sendMobilePush(
          endpoints.map((item) => item.endpoint),
          payload,
        );
      }

      await prisma.notification.create({
        data: {
          trialId: job.trialId,
          channel: job.channel,
          reminderOffset: `${offsetHours}h`,
          payload,
        },
      });

      await prisma.reminderJob.update({
        where: { id: job.id },
        data: { status: "SENT", sentAt: now },
      });

      log("info", "Reminder sent", { jobId: job.id, channel: job.channel });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown reminder failure";
      await prisma.reminderJob.update({
        where: { id: job.id },
        data: {
          attempts: { increment: 1 },
          status: addHours(job.scheduledFor, 1) < now ? "FAILED" : "PENDING",
          lastError: message.slice(0, 600),
        },
      });
      log("error", "Reminder job failed", { jobId: job.id, message });
    }
  }

  return jobs.length;
}
