import { SignJWT, jwtVerify } from "jose";
import { env } from "@/src/lib/env";

const secret = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export async function createMobileLinkToken(userId: string) {
  return new SignJWT({ userId, purpose: "mobile-link" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyMobileLinkToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (payload.purpose !== "mobile-link" || typeof payload.userId !== "string") {
    throw new Error("Invalid mobile link token");
  }

  return payload.userId;
}
