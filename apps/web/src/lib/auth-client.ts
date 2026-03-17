"use client";

import { signOut } from "next-auth/react";

export const LOGOUT_CALLBACK_URL = "/";

export async function logoutWithRedirect() {
  return signOut({ callbackUrl: LOGOUT_CALLBACK_URL });
}
