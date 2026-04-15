"use client";

import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-5 z-40 inline-flex size-11 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.06] text-zinc-400 backdrop-blur-xl transition hover:translate-y-[-1px] hover:bg-white/[0.1] hover:text-white"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
