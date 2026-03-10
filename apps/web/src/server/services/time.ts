import { differenceInCalendarDays } from "date-fns";

export function getDaysRemaining(billingDate: Date, now = new Date()): number {
  return differenceInCalendarDays(billingDate, now);
}

export function reminderDates(billingDate: Date) {
  return [48, 24].map((hours) => new Date(billingDate.getTime() - hours * 60 * 60 * 1000));
}

export function normalizeServiceName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
