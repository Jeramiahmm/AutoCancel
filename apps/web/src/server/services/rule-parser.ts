import { addDays } from "date-fns";

type RuleParseResult = {
  serviceName: string | null;
  trialLengthDays: number | null;
  billingDate: Date | null;
  cost: number | null;
  currency: string | null;
};

const dayRegex = /(\d{1,3})\s*(day|days)/i;
const dollarRegex = /\$\s*(\d+(?:\.\d{1,2})?)/;

export function parseByRules(subject: string, body: string): RuleParseResult {
  const text = `${subject}\n${body}`;
  const lower = text.toLowerCase();

  const serviceName =
    subject
      .replace(/(welcome to|your|free trial|trial|subscription|is active|confirmation)/gi, "")
      .replace(/[:-]/g, " ")
      .trim() || null;

  const dayMatch = lower.match(dayRegex);
  const trialLengthDays = dayMatch ? Number(dayMatch[1]) : null;

  const startsToday = /starts today|begins today|trial starts/i.test(lower);
  const billingDate =
    trialLengthDays && (startsToday || /free trial/i.test(lower))
      ? addDays(new Date(), trialLengthDays)
      : null;

  const costMatch = text.match(dollarRegex);
  const cost = costMatch ? Number(costMatch[1]) : null;

  return {
    serviceName,
    trialLengthDays,
    billingDate,
    cost,
    currency: cost ? "USD" : null,
  };
}
