"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function TryDemoButton({ className }: { className?: string }) {
  const [pending, setPending] = useState(false);

  async function handleDemo() {
    setPending(true);
    const result = await signIn("demo", { callbackUrl: "/dashboard", redirect: false });
    setPending(false);

    if (result?.url) {
      window.location.href = result.url;
      return;
    }

    window.location.href = "/auth/signin?demo=1";
  }

  return (
    <Button className={className} variant="outline" onClick={handleDemo} disabled={pending}>
      {pending ? "Opening demo..." : "Try Demo"}
    </Button>
  );
}
