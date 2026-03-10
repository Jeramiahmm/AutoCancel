import OpenAI from "openai";
import { TrialExtractionSchema, type TrialExtraction } from "@autocancel/shared";
import { env, hasOpenAi } from "@/src/lib/env";
import { parseByRules } from "@/src/server/services/rule-parser";

function normalizeExtraction(input: Partial<TrialExtraction>): TrialExtraction {
  return TrialExtractionSchema.parse({
    serviceName: input.serviceName || "Unknown service",
    trialLengthDays: input.trialLengthDays ?? null,
    startDate: input.startDate ?? null,
    billingDate: input.billingDate ?? null,
    subscriptionCost: input.subscriptionCost ?? null,
    currency: input.currency ?? null,
    subscriptionType: input.subscriptionType ?? null,
    confidence: input.confidence ?? 0.4,
    evidence: input.evidence ?? [],
  });
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0];
  }

  return trimmed;
}

export async function parseTrialFromEmail(subject: string, body: string): Promise<TrialExtraction> {
  const fallback = parseByRules(subject, body);

  try {
    if (!hasOpenAi()) {
      throw new Error("OpenAI not configured");
    }

    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const prompt = [
      "Extract service name, trial duration, billing date, subscription cost, and subscription type from this email.",
      "Return strict JSON with keys: serviceName, trialLengthDays, startDate, billingDate, subscriptionCost, currency, subscriptionType, confidence, evidence.",
      "Dates must be ISO-8601 or null. Confidence is 0-1.",
      `Subject: ${subject}`,
      `Body: ${body.slice(0, 6000)}`,
    ].join("\n");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.1,
    });

    const text = response.output_text;
    const parsed = JSON.parse(extractJson(text)) as Partial<TrialExtraction>;

    return normalizeExtraction(parsed);
  } catch {
    return normalizeExtraction({
      serviceName: fallback.serviceName ?? "Unknown service",
      trialLengthDays: fallback.trialLengthDays,
      startDate: null,
      billingDate: fallback.billingDate ? fallback.billingDate.toISOString() : null,
      subscriptionCost: fallback.cost,
      currency: fallback.currency,
      subscriptionType: "subscription",
      confidence: fallback.serviceName ? 0.55 : 0.35,
      evidence: ["rule-based fallback"],
    });
  }
}
