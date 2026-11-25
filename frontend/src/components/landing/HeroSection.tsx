"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, BookOpen, LogIn } from "lucide-react";
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

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <>
      <section
        id="beranda"
        ref={heroRef}
        className="relative min-h-[92svh] w-full overflow-hidden bg-[#E9DCCB] pt-28 pb-36 flex items-center"
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
            className="h-full w-full object-cover object-center sm:object-right"
          />
          <div className="absolute inset-0 bg-[#F6EFE6]/82 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#F6EFE6]/95 sm:via-[#F6EFE6]/62 sm:to-transparent" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Perpustakaan Sekolah Digital
            </p>

            <h1 className="font-editorial mt-3 text-4xl font-bold leading-[1.12] tracking-tight text-[#2B1D14] sm:text-5xl lg:text-6xl">
              Temukan Buku,{" "}
              <span className="text-[#A8643A]">Tumbuhkan Wawasan.</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#2B1D14]/85 sm:text-lg">
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

        <a
          href="#cerita"
          aria-label="Gulir ke bagian cerita"
          className="absolute bottom-20 sm:bottom-24 left-1/2 z-20 -translate-x-1/2 inline-flex flex-col items-center gap-1 rounded-full border border-[#D7C7B4] bg-[#FBF7F1]/95 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B1D14] shadow-sm transition-colors hover:bg-[#E9DCCB]"
        >
          <span>Gulir ke Bawah</span>
          <ArrowDown size={14} strokeWidth={1.75} className="text-[#A8643A]" />
        </a>

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
            className="block w-full h-20 sm:h-28 md:h-32 object-fill"
          />
          <div className="h-8 w-full bg-[#FBF7F1]" />
        </motion.div>
      </section>

      <section className="relative z-20 border-b border-[#D7C7B4] bg-[#FBF7F1] py-7 px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p className="font-editorial text-2xl font-bold text-[#2B1D14] tabular-nums">
                {item.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-[#8C7B6B]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
