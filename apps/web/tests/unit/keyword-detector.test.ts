import { describe, expect, it } from "vitest";
import { isLikelyTrialEmail, scoreKeywordMatch } from "@/src/server/services/keyword-detector";

describe("keyword detector", () => {
  it("scores trial-like emails", () => {
    const score = scoreKeywordMatch(
      "Your Netflix free trial is active",
      "Billing begins in 7 days unless you cancel.",
    );
    expect(score).toBeGreaterThan(0.4);
  });

  it("rejects unrelated emails", () => {
    expect(isLikelyTrialEmail("Meeting invite", "Agenda for tomorrow")).toBe(false);
  });
});
