import { test, expect } from "@playwright/test";

test("landing page headline and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Never forget to cancel a free trial again/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Connect your email/i }).first()).toBeVisible();
});
