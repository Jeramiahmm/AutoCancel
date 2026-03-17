import { describe, expect, it } from "vitest";
import { getAuthErrorMessage, toAuthErrorCode } from "@/src/lib/auth-errors";

describe("auth error helpers", () => {
  it("maps provider token failures to safe codes", () => {
    const code = toAuthErrorCode(new Error("Google token exchange failed: 401"), "unknown_error");
    expect(code).toBe("oauth_token_exchange_failed");
  });

  it("maps unknown errors to fallback", () => {
    const code = toAuthErrorCode(new Error("something odd"), "oauth_callback_failed");
    expect(code).toBe("oauth_callback_failed");
  });

  it("returns friendly message for known code", () => {
    expect(getAuthErrorMessage("oauth_not_configured")).toContain("OAuth is not configured");
  });
});
