import { describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn();

vi.mock("next-auth/react", () => ({
  signOut: signOutMock,
}));

describe("auth client helpers", () => {
  it("logs out with home callback redirect", async () => {
    const { LOGOUT_CALLBACK_URL, logoutWithRedirect } = await import("@/src/lib/auth-client");
    await logoutWithRedirect();
    expect(LOGOUT_CALLBACK_URL).toBe("/");
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});
