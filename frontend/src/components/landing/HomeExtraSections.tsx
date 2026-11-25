"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Compass,
  Feather,
  Globe2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const CATEGORIES = [
  {
    icon: Feather,
    title: "Sastra & Fiksi",
    desc: "Novel remaja, antologi puisi, cerita rakyat nusantara, serta karya fiksi pilihan.",
  },
  {
    icon: Atom,
    title: "Sains & Teknologi",
    desc: "Ensiklopedia fisika, biologi, kimia, dan pengantar rekayasa teknologi modern.",
  },
  {
    icon: Globe2,
    title: "Sejarah & Budaya",
    desc: "Kisah peradaban dunia, sejarah kemerdekaan, serta khazanah budaya bangsa.",
  },
  {
    icon: Compass,
    title: "Matematika & Logika",
    desc: "Buku pendalaman konsep hitung, teka-teki logika, dan persiapan olimpiade.",
  },
  {
    icon: BookOpen,
    title: "Referensi & Kamus",
    desc: "Kamus bahasa Indonesia, bahasa asing, atlas tematik, dan ensiklopedia umum.",
  },
  {
    icon: GraduationCap,
    title: "Karya Ilmiah & Bahasa",
    desc: "Panduan penulisan esai, karya tulis remaja, dan literatur pengayaan kelas.",
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HomeExtraSections() {
  return (
    <>
      <section className="relative py-20 md:py-24 bg-[var(--bg-primary)] transition-colors overflow-hidden">
        <AmbientSparkles />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="max-w-2xl mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Ragam Koleksi Perpustakaan
            </p>
            <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              Jelajahi Rak Berdasarkan Minat Baca
            </h2>
            <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
              Setiap judul dikelompokkan rapi menurut bidang pengetahuan agar siswa mudah
              menemukan bacaan pelajaran maupun hiburan yang bermutu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.08 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: SMOOTH_EASE }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-xs transition-colors hover:border-[var(--accent-primary)]/50 transform-gpu"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-primary)]">
                    <Icon size={19} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-editorial mt-4 text-lg font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[var(--bg-surface)] transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="mx-auto max-w-5xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Siap Membaca Hari Ini?
            </p>
            <h2 className="font-editorial mt-2 text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Mulai Jelajahi Koleksi Buku Sekolah Sekarang
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Daftarkan keanggotaan Anda dalam hitungan menit atau masuk ke portal anggota
              untuk memeriksa ketersediaan buku di rak.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="pill">
              <Link href="/register">
                Daftar Anggota
                <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="pill">
              <Link href="/login">Masuk Portal</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
