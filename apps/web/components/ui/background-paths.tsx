"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.03 + path.id * 0.008}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.15, 0.35, 0.15],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 24 + Math.random() * 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title,
  subtitle,
  ctaLabel = "Connect your email",
  ctaHref = "/auth/signin",
}: {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-glow backdrop-blur-xl md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(139,92,246,.12),transparent_34%),radial-gradient(circle_at_86%_16%,rgba(6,182,212,.1),transparent_30%)]" />
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="mr-3 inline-block last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.06 + letterIndex * 0.025,
                      type: "spring",
                      stiffness: 160,
                      damping: 24,
                    }}
                    className="inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-zinc-400 md:text-lg">{subtitle}</p>

          <Button
            asChild
            className="rounded-2xl px-8 py-6 text-base font-semibold"
          >
            <a href={ctaHref}>
              {ctaLabel}
              <span className="ml-3 transition-transform duration-300 hover:translate-x-0.5">→</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
