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
    <Button variant="outline" onClick={handleLogout} disabled={pending}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
