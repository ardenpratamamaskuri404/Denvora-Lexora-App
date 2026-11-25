"use client";

import { motion } from "motion/react";

interface SparkleSpec {
  left: string;
  top: string;
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  kind: "star" | "dot";
}

const PARTICLES: SparkleSpec[] = [
  { left: "10%", top: "18%", size: 14, dx: 18, dy: -22, duration: 6.2, delay: 0.1, kind: "star" },
  { left: "24%", top: "74%", size: 10, dx: -14, dy: -18, duration: 5.6, delay: 0.8, kind: "dot" },
  { left: "38%", top: "24%", size: 12, dx: 20, dy: -16, duration: 7.0, delay: 1.4, kind: "star" },
  { left: "52%", top: "14%", size: 9, dx: -12, dy: 16, duration: 5.8, delay: 0.4, kind: "dot" },
  { left: "64%", top: "68%", size: 15, dx: 22, dy: -20, duration: 6.6, delay: 1.1, kind: "star" },
  { left: "78%", top: "22%", size: 11, dx: -18, dy: -14, duration: 6.0, delay: 1.9, kind: "dot" },
  { left: "88%", top: "54%", size: 14, dx: -16, dy: -24, duration: 7.2, delay: 0.5, kind: "star" },
  { left: "16%", top: "48%", size: 11, dx: 15, dy: -14, duration: 6.4, delay: 2.1, kind: "star" },
  { left: "46%", top: "82%", size: 12, dx: -18, dy: -18, duration: 6.8, delay: 1.6, kind: "star" },
  { left: "72%", top: "84%", size: 9, dx: 14, dy: -16, duration: 5.4, delay: 0.3, kind: "dot" },
];

export function AmbientSparkles({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        animate={{ x: [0, 28, -12, 0], y: [0, -18, 14, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 left-[12%] h-64 w-64 rounded-full bg-[var(--accent-primary)]/14 blur-3xl transform-gpu"
      />
      <motion.div
        animate={{ x: [0, -24, 16, 0], y: [0, 20, -12, 0], opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-[14%] h-72 w-72 rounded-full bg-[var(--accent-primary)]/12 blur-3xl transform-gpu"
      />

      {PARTICLES.map((p, idx) => (
        <motion.div
          key={`${p.left}-${p.top}-${idx}`}
          style={{ left: p.left, top: p.top }}
          animate={{
            x: [0, p.dx, -p.dx * 0.4, 0],
            y: [0, p.dy, p.dy * 0.3, 0],
            scale: [0.75, 1.2, 0.85, 0.75],
            opacity: [0.22, 0.8, 0.35, 0.22],
            rotate: p.kind === "star" ? [0, 28, -12, 0] : 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute transform-gpu will-change-transform text-[var(--accent-primary)]"
        >
          {p.kind === "star" ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1 Q12 12 23 12 Q12 12 12 23 Q12 12 1 12 Q12 12 12 1 Z" />
            </svg>
          ) : (
            <span
              style={{ width: p.size * 0.55, height: p.size * 0.55 }}
              className="block rounded-full bg-[var(--accent-primary)]/70 shadow-[0_0_10px_var(--accent-primary)]"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
