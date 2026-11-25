"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StoryRevealSection() {
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.0005,
  });

  const leftWordX = useTransform(smoothProgress, [0, 0.55], [0, -240]);
  const rightWordX = useTransform(smoothProgress, [0, 0.55], [0, 240]);
  const wordOpacity = useTransform(smoothProgress, [0.28, 0.68], [1, 0]);
  const frameScale = useTransform(smoothProgress, [0.02, 0.65], [0.58, 1]);
  const frameY = useTransform(smoothProgress, [0.02, 0.65], [16, 0]);
  const captionOpacity = useTransform(smoothProgress, [0.5, 0.85], [0, 1]);
  const captionY = useTransform(smoothProgress, [0.5, 0.85], [20, 0]);

  return (
    <section
      id="cerita"
      ref={containerRef}
      className="relative h-[175vh] bg-[var(--bg-surface)] transition-colors"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-5xl items-center justify-center"
        >
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-1 sm:gap-2 select-none">
            <motion.span
              style={{ x: leftWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[var(--accent-primary)] sm:text-7xl md:text-8xl transform-gpu will-change-transform"
            >
              CER
            </motion.span>
            <motion.span
              style={{ x: rightWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[var(--accent-primary)] sm:text-7xl md:text-8xl transform-gpu will-change-transform"
            >
              ITA
            </motion.span>
          </div>

          <motion.div
            style={{ scale: frameScale, y: frameY }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_28px_70px_rgba(43,29,20,0.2)] transform-gpu will-change-transform"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-[var(--bg-primary)]">
              <video
                src="/videos/denvora-landing-welcome.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2B1D14]/75 via-transparent to-transparent" />

              <motion.div
                style={{ opacity: captionOpacity, y: captionY }}
                className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-[#F6EFE6] flex flex-col sm:flex-row sm:items-end justify-between gap-4 transform-gpu will-change-transform"
              >
                <div className="max-w-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E9DCCB]">
                    Selamat Datang di Denvora Lexora
                  </p>
                  <h2 className="font-editorial mt-1.5 text-lg font-bold leading-snug sm:text-2xl">
                    Setiap buku menemukan pembacanya, setiap halaman membuka cakrawala baru.
                  </h2>
                </div>
                <Button asChild size="pill" className="shrink-0">
                  <Link href="/fitur">
                    Jelajahi Layanan
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
