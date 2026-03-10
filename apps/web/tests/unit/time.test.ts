import { describe, expect, it } from "vitest";
import { normalizeServiceName, reminderDates } from "@/src/server/services/time";

describe("time helpers", () => {
  it("creates 24h and 48h reminder dates", () => {
    const billingDate = new Date("2026-04-09T12:00:00.000Z");
    const [first, second] = reminderDates(billingDate);

    expect(first.toISOString()).toBe("2026-04-07T12:00:00.000Z");
    expect(second.toISOString()).toBe("2026-04-08T12:00:00.000Z");
  });

  it("normalizes provider names", () => {
    expect(normalizeServiceName("Canva Pro!!!")).toBe("canva-pro");
  });
});
