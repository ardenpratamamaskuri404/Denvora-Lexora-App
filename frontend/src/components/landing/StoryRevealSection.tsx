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
    stiffness: 85,
    damping: 24,
    mass: 0.5,
  });

  const leftWordX = useTransform(smoothProgress, [0, 0.58], ["0vw", "-26vw"]);
  const rightWordX = useTransform(smoothProgress, [0, 0.58], ["0vw", "26vw"]);
  const wordOpacity = useTransform(smoothProgress, [0.3, 0.72], [1, 0]);
  const frameScale = useTransform(smoothProgress, [0.04, 0.68], [0.5, 1]);
  const frameRadius = useTransform(smoothProgress, [0.04, 0.68], [32, 20]);
  const captionOpacity = useTransform(smoothProgress, [0.52, 0.86], [0, 1]);
  const captionY = useTransform(smoothProgress, [0.52, 0.86], [24, 0]);

  return (
    <section
      id="cerita"
      ref={containerRef}
      className="relative h-[185vh] bg-[var(--bg-surface)] transition-colors"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div className="relative flex w-full max-w-5xl items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-1 sm:gap-2 select-none">
            <motion.span
              style={{ x: leftWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[var(--accent-primary)] sm:text-7xl md:text-8xl"
            >
              CER
            </motion.span>
            <motion.span
              style={{ x: rightWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[var(--accent-primary)] sm:text-7xl md:text-8xl"
            >
              ITA
            </motion.span>
          </div>

          <motion.div
            style={{ scale: frameScale, borderRadius: frameRadius }}
            className="relative z-10 w-full max-w-4xl overflow-hidden border-2 border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_28px_70px_rgba(43,29,20,0.2)]"
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
                className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-[#F6EFE6] flex flex-col sm:flex-row sm:items-end justify-between gap-4"
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
        </div>
      </div>
    </section>
  );
}
