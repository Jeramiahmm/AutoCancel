import { redirect } from "next/navigation";
import { getAuthSession } from "@/src/lib/auth";

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session;
}
