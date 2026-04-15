import * as React from "react";
import { cn } from "@/src/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/30",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
