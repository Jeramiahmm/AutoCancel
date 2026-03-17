import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

function resetBaseEnv() {
  process.env = {
    ...originalEnv,
    NODE_ENV: "test",
    NEXTAUTH_URL: "http://localhost:3000",
    APP_BASE_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "test-secret",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    SMTP_HOST: "",
    SMTP_USER: "",
    SMTP_PASSWORD: "",
    SMTP_FROM: "",
  };
}

describe("auth options provider registration", () => {
  beforeEach(() => {
    vi.resetModules();
    resetBaseEnv();
  });

  afterEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("does not register credentials demo provider", async () => {
    const { authOptions } = await import("@/src/lib/auth");
    const providerIds = authOptions.providers?.map((provider) => provider.id) ?? [];
    expect(providerIds).not.toContain("credentials");
  });

  it("registers google provider only when both OAuth env vars are set", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";

    const { authOptions } = await import("@/src/lib/auth");
    const providerIds = authOptions.providers?.map((provider) => provider.id) ?? [];
    expect(providerIds).toContain("google");
  });

  it("does not register google provider when client secret is missing", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "";

    const { authOptions } = await import("@/src/lib/auth");
    const providerIds = authOptions.providers?.map((provider) => provider.id) ?? [];
    expect(providerIds).not.toContain("google");
  });

  it("registers email provider when SMTP settings exist", async () => {
    Object.assign(process.env, {
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "587",
      SMTP_USER: "smtp-user",
      SMTP_PASSWORD: "smtp-password",
      SMTP_FROM: "alerts@autocancel.app",
    });

    const { authOptions } = await import("@/src/lib/auth");
    const providerIds = authOptions.providers?.map((provider) => provider.id) ?? [];
    expect(providerIds).toContain("email");
  });

  it("enforces safe redirect callback behavior", async () => {
    const { authOptions } = await import("@/src/lib/auth");
    const redirect = authOptions.callbacks?.redirect;
    expect(redirect).toBeDefined();

    const internal = await redirect?.({ url: "/dashboard", baseUrl: "https://autocancel.app" });
    expect(internal).toBe("https://autocancel.app/dashboard");

    const sameOrigin = await redirect?.({
      url: "https://autocancel.app/history",
      baseUrl: "https://autocancel.app",
    });
    expect(sameOrigin).toBe("https://autocancel.app/history");

    const external = await redirect?.({ url: "https://evil.example", baseUrl: "https://autocancel.app" });
    expect(external).toBe("https://autocancel.app");
  });
});
