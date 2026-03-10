import { describe, expect, it } from "vitest";
import { TrialExtractionSchema } from "./contracts";

describe("TrialExtractionSchema", () => {
  it("accepts valid extraction payload", () => {
    const parsed = TrialExtractionSchema.parse({
      serviceName: "Netflix",
      trialLengthDays: 7,
      startDate: new Date().toISOString(),
      billingDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      subscriptionCost: 14.99,
      currency: "USD",
      subscriptionType: "monthly",
      confidence: 0.89,
      evidence: ["free trial", "billing begins"],
    });

    expect(parsed.serviceName).toBe("Netflix");
  });
});
