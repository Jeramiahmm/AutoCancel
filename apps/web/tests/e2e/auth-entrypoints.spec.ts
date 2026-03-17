import { expect, test } from "@playwright/test";

test("landing auth entry points route to sign-in", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /connect email/i }).first().click();
  await expect(page).toHaveURL(/\/auth\/signin/);

  await page.goto("/");
  await page.getByRole("link", { name: /log in/i }).first().click();
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test("oauth start route either redirects to provider or safe dashboard error", async ({ page }) => {
  await page.goto("/oauth/google");

  await expect
    .poll(async () => page.url())
    .toMatch(/accounts\.google\.com|\/dashboard\?connect_error=oauth_not_configured|\/dashboard\?connect_error=oauth_client_missing/);
});
