"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logoutWithRedirect } from "@/src/lib/auth-client";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await logoutWithRedirect();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="rounded-full border-black/15 bg-white/70 px-4 text-[#2f2c27] hover:bg-white"
      onClick={handleLogout}
      disabled={pending}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
