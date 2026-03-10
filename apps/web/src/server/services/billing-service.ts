import Stripe from "stripe";
import { env, hasStripe } from "@/src/lib/env";
import { prisma } from "@/src/server/db";

function getStripe() {
  if (!hasStripe() || !env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured for this environment");
  }

  return new Stripe(env.STRIPE_SECRET_KEY);
}

export async function ensureStripeCustomer(userId: string, email: string) {
  const stripe = getStripe();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(userId: string, email: string) {
  if (!env.STRIPE_PRICE_PREMIUM_MONTHLY) {
    throw new Error("Stripe pricing is not configured");
  }

  const stripe = getStripe();
  const customerId = await ensureStripeCustomer(userId, email);

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: env.STRIPE_PRICE_PREMIUM_MONTHLY, quantity: 1 }],
    success_url: `${env.APP_BASE_URL}/dashboard?checkout=success`,
    cancel_url: `${env.APP_BASE_URL}/dashboard?checkout=cancelled`,
    allow_promotion_codes: true,
    metadata: {
      userId,
    },
  });
}

export async function createBillingPortalSession(userId: string) {
  const stripe = getStripe();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.stripeCustomerId) {
    throw new Error("No billing account");
  }

  return stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${env.APP_BASE_URL}/dashboard`,
  });
}

export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook secret is not configured");
  }

  if (!signature) {
    throw new Error("Missing stripe signature");
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { tier: "PREMIUM" },
      });

      if (session.subscription) {
        await prisma.billingSubscription.upsert({
          where: { stripeSubscriptionId: String(session.subscription) },
          update: {
            status: "active",
          },
          create: {
            userId,
            stripeSubscriptionId: String(session.subscription),
            status: "active",
          },
        });
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const existing = await prisma.billingSubscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existing) {
      await prisma.billingSubscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
        },
      });

      await prisma.user.update({
        where: { id: existing.userId },
        data: { tier: subscription.status === "active" ? "PREMIUM" : "FREE" },
      });
    }
  }

  return event.id;
}
