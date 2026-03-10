import { ok } from "@/src/lib/api";
import { env } from "@/src/lib/env";

export async function GET() {
  return ok({ publicKey: env.VAPID_PUBLIC_KEY });
}
