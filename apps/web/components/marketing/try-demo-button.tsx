"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function TryDemoButton({ className }: { className?: string }) {
  return (
    <Button className={className} variant="outline" onClick={() => signIn("demo", { callbackUrl: "/dashboard" })}>
      Try Demo
    </Button>
  );
}
