import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      tier?: "FREE" | "PREMIUM";
      timezone?: string;
      isDemo?: boolean;
    };
  }
}
