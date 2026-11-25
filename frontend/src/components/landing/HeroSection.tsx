"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, BookOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  { value: "3 Peran", label: "Siswa, Petugas & Admin" },
  { value: "4 Tabel", label: "Relasi MySQL Terstruktur" },
  { value: "Real-Time", label: "Sinkronisasi Stok Otomatis" },
  { value: "Offline", label: "Berjalan Penuh di Localhost" },
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 160,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 160,
    damping: 22,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <>
      <section
        id="beranda"
        ref={heroRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative min-h-[88svh] w-full overflow-hidden bg-[#E9DCCB] pt-28 pb-32 flex items-center"
      >
        <motion.div
          style={{ y: bgY, rotateX, rotateY, transformPerspective: 1200 }}
          className="pointer-events-none absolute inset-0"
        >
          <Image
            src="/images/denvora-landing-hero.svg"
            alt="Ilustrasi Perpustakaan Digital Denvora Lexora"
            width={1920}
            height={1080}
            priority
            className="h-full w-full object-cover object-center sm:object-right opacity-95"
          />
          <div className="absolute inset-0 bg-[#F6EFE6]/82 sm:bg-transparent sm:bg-gradient-to-r sm:from-[#F6EFE6]/96 sm:via-[#F6EFE6]/82 sm:to-[#F6EFE6]/18" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <motion.div
            style={{ y: textY }}
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
              Kelola katalog buku, keanggotaan siswa, serta peminjaman dan pengembalian
              dalam satu alur lokal yang cepat dan tertib.
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
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 inline-flex flex-col items-center gap-1 rounded-full border border-[#D7C7B4] bg-[#FBF7F1]/95 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B1D14] shadow-sm transition-colors hover:bg-[#E9DCCB]"
        >
          <span>Gulir ke Bawah</span>
          <ArrowDown size={14} strokeWidth={1.75} className="text-[#A8643A]" />
        </a>

        <Image
          src="/images/wave-divider.svg"
          alt=""
          aria-hidden="true"
          width={1440}
          height={120}
          className="pointer-events-none absolute bottom-0 left-0 w-full h-14 sm:h-20 object-fill"
        />
      </section>

      <section className="border-b border-[#D7C7B4] bg-[#FBF7F1] py-7 px-6">
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
