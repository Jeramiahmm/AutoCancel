import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseByRules } from "@/src/server/services/rule-parser";

describe("rule parser", () => {
  it("extracts trial length and cost from fixture", () => {
    const fixture = readFileSync(join(process.cwd(), "tests/fixtures/netflix-trial-email.txt"), "utf8");
    const [subjectLine, ...bodyLines] = fixture.split("\n");
    const subject = subjectLine.replace("Subject: ", "");
    const body = bodyLines.join("\n");

    const parsed = parseByRules(subject, body);

    expect(parsed.trialLengthDays).toBe(7);
    expect(parsed.cost).toBe(15.49);
    expect(parsed.currency).toBe("USD");
  });
});
