import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});

const requireAuthMock = vi.fn();
const connectProviderMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/src/lib/auth-guard", () => ({
  requireAuth: requireAuthMock,
}));

vi.mock("@/src/server/services/integration-service", () => ({
  connectProvider: connectProviderMock,
}));

describe("google oauth callback page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({ user: { id: "user_123" } });
  });

  it("redirects to missing_code when callback has no code", async () => {
    const mod = await import("@/app/oauth/callback/google/page");
    await expect(mod.default({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      "REDIRECT:/dashboard?connect_error=missing_code",
    );
  });

  it("redirects with safe error code when connection fails", async () => {
    connectProviderMock.mockRejectedValue(new Error("Google token exchange failed: 400"));
    const mod = await import("@/app/oauth/callback/google/page");
    await expect(
      mod.default({
        searchParams: Promise.resolve({ code: "oauth-code" }),
      }),
    ).rejects.toThrow("REDIRECT:/dashboard?connect_error=oauth_token_exchange_failed");
  });
});
