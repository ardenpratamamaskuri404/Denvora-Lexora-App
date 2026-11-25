"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const HIGHLIGHTS = [
  { value: "Koleksi Lengkap", label: "Fiksi, Sains, Sejarah & Referensi" },
  { value: "Pantau Rak", label: "Ketersediaan Buku Selalu Terkini" },
  { value: "7 Hari Pinjam", label: "Durasi Baca Nyaman & Teratur" },
  { value: "Akses Mudah", label: "Cari Judul & Kategori Seketika" },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.0005,
  });

  const bgY = useTransform(smoothProgress, [0, 1], [0, 24]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.06]);
  const textY = useTransform(smoothProgress, [0, 1], [0, 22]);
  const waveY = useTransform(smoothProgress, [0, 1], [0, -14]);

  return (
    <>
      <section
        id="beranda"
        ref={heroRef}
        className="relative min-h-[94svh] sm:min-h-[100svh] w-full overflow-hidden bg-[var(--bg-surface)] pt-32 pb-28 sm:pt-36 sm:pb-32 flex items-center transition-colors"
      >
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="pointer-events-none absolute -top-6 inset-x-0 bottom-0 transform-gpu will-change-transform"
        >
          <Image
            src="/images/denvora-landing-hero.svg"
            alt="Ilustrasi Perpustakaan Digital Denvora Lexora"
            width={1920}
            height={1080}
            priority
            className="h-full w-full object-cover object-center lg:object-right dark:brightness-[0.92] dark:contrast-[1.06]"
          />
          <div className="absolute inset-0 bg-[#F6EFE6]/82 dark:bg-[#18110C]/55 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#F6EFE6]/92 sm:via-[#F6EFE6]/45 sm:via-45% sm:to-transparent dark:sm:from-[#18110C]/95 dark:sm:via-[#18110C]/58 dark:sm:via-45% dark:sm:to-transparent" />
        </motion.div>

        <AmbientSparkles className="z-[5]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: SMOOTH_EASE }}
            className="max-w-xl transform-gpu will-change-transform"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Perpustakaan Sekolah Digital
            </p>

            <h1 className="font-editorial mt-2.5 text-3xl font-bold leading-[1.15] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.4rem]">
              Temukan Buku,{" "}
              <span className="text-[var(--accent-primary)]">Tumbuhkan Wawasan.</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[var(--text-primary)]/85 sm:text-lg">
              <strong>Denvora Lexora</strong> — <em>Where Knowledge Finds Its Way.</em>{" "}
              Jelajahi ribuan bahan bacaan sekolah, periksa ketersediaan rak secara
              langsung, dan kelola peminjaman buku Anda dengan tertib.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Button asChild size="pill">
                <Link href="/register">
                  <BookOpen size={17} strokeWidth={1.75} />
                  Daftar Anggota
                </Link>
              </Button>
              <Button asChild variant="outline" size="pill">
                <Link href="/login">
                  <LogIn size={17} strokeWidth={1.75} />
                  Masuk ke Sistem
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: waveY }}
          className="pointer-events-none absolute -bottom-7 left-0 z-10 w-full transform-gpu will-change-transform"
        >
          <Image
            src="/images/wave-divider.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={160}
            className="block dark:hidden w-full h-16 sm:h-24 md:h-28 object-fill"
          />
          <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="hidden dark:block w-full h-16 sm:h-24 md:h-28"
          >
            <path
              d="M0 38 C210 112, 430 118, 700 62 C970 6, 1220 18, 1440 76 L1440 160 L0 160 Z"
              fill="#241913"
              fillOpacity="0.82"
            />
            <path
              d="M0 58 C245 128, 495 130, 760 72 C1025 14, 1255 34, 1440 88 L1440 160 L0 160 Z"
              fill="#C87E4F"
              fillOpacity="0.28"
            />
            <path
              d="M0 58 C245 128, 495 130, 760 72 C1025 14, 1255 34, 1440 88"
              stroke="#C87E4F"
              strokeOpacity="0.82"
              strokeWidth="3.5"
              fill="none"
            />
            <path
              d="M0 78 C270 140, 520 138, 790 88 C1055 38, 1270 52, 1440 100 L1440 160 L0 160 Z"
              fill="#18110C"
            />
          </svg>
          <div className="h-7 w-full bg-[var(--bg-primary)]" />
        </motion.div>
      </section>

      <section className="relative z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-5 sm:py-6 px-6 transition-colors">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 md:grid-cols-4">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: SMOOTH_EASE }}
              className="text-center md:text-left"
            >
              <p className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)] tabular-nums">
                {item.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
