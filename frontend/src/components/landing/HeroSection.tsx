"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { value: "Koleksi Lengkap", label: "Fiksi, Sains, Sejarah & Referensi" },
  { value: "Pantau Rak", label: "Ketersediaan Buku Selalu Terkini" },
  { value: "7 Hari Pinjam", label: "Durasi Baca Nyaman & Teratur" },
  { value: "Akses Mudah", label: "Cari Judul & Kategori Seketika" },
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.25]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, -22]);

  return (
    <>
      <section
        id="beranda"
        ref={heroRef}
        className="relative min-h-[78svh] sm:min-h-[82svh] w-full overflow-hidden bg-[var(--bg-surface)] pt-32 pb-28 sm:pt-36 sm:pb-32 flex items-center transition-colors"
      >
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="pointer-events-none absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/denvora-landing-hero.svg"
            alt="Ilustrasi Perpustakaan Digital Denvora Lexora"
            width={1920}
            height={1080}
            priority
            className="h-full w-full object-cover object-[70%_35%] sm:object-[right_30%] dark:opacity-55"
          />
          <div className="absolute inset-0 bg-[#F6EFE6]/84 dark:bg-[#18110C]/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#F6EFE6]/95 sm:via-[#F6EFE6]/64 sm:to-transparent dark:sm:from-[#18110C]/95 dark:sm:via-[#18110C]/65 dark:sm:to-transparent" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Perpustakaan Sekolah Digital
            </p>

            <h1 className="font-editorial mt-3 text-4xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Temukan Buku,{" "}
              <span className="text-[var(--accent-primary)]">Tumbuhkan Wawasan.</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[var(--text-primary)]/85 sm:text-lg">
              <strong>Denvora Lexora</strong> — <em>Where Knowledge Finds Its Way.</em>{" "}
              Jelajahi ribuan bahan bacaan sekolah, periksa ketersediaan rak secara
              langsung, dan kelola peminjaman buku Anda dengan tertib.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
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
          className="pointer-events-none absolute -bottom-8 left-0 z-10 w-full will-change-transform"
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
              d="M0 46 C240 122, 480 128, 760 66 C1030 6, 1255 24, 1440 72 L1440 160 L0 160 Z"
              fill="#4A3528"
              fillOpacity="0.55"
            />
            <path
              d="M0 64 C265 130, 520 128, 785 74 C1045 20, 1265 36, 1440 84 L1440 160 L0 160 Z"
              fill="#241913"
              fillOpacity="0.92"
            />
            <path
              d="M0 64 C265 130, 520 128, 785 74 C1045 20, 1265 36, 1440 84"
              stroke="#C87E4F"
              strokeOpacity="0.55"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M0 84 C290 142, 540 138, 800 90 C1060 42, 1275 56, 1440 98 L1440 160 L0 160 Z"
              fill="#2E2017"
            />
          </svg>
          <div className="h-8 w-full bg-[var(--surface-elevated)]" />
        </motion.div>
      </section>

      <section className="relative z-20 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)] py-6 sm:py-7 px-6 transition-colors">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                {item.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
