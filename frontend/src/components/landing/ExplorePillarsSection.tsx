"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookMarked, Clock, ShieldCheck } from "lucide-react";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const LIBRARY_PILLARS = [
  {
    href: "/fitur",
    title: "Katalog & Ketersediaan",
    desc: "Cari ribuan koleksi bacaan berdasarkan judul, pengarang, dan status rak terkini.",
    linkLabel: "Lihat Layanan",
    icon: BookMarked,
  },
  {
    href: "/alur",
    title: "Sirkulasi Tertib",
    desc: "Proses peminjaman dan pengembalian yang ringkas dengan masa pinjam terukur 7 hari.",
    linkLabel: "Lihat Panduan",
    icon: Clock,
  },
  {
    href: "/tentang",
    title: "Ruang Literasi Sekolah",
    desc: "Pelajari tata tertib keanggotaan, jam layanan perpustakaan, serta jawaban umum.",
    linkLabel: "Tentang Perpustakaan",
    icon: ShieldCheck,
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ExplorePillarsSection() {
  return (
    <section className="relative py-20 md:py-24 bg-[var(--bg-surface)] transition-colors overflow-hidden">
      <AmbientSparkles />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            Pengalaman Membaca Lebih Nyaman
          </p>
          <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Semua Kebutuhan Literasi dalam Satu Tempat
          </h2>
          <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
            Dirancang untuk mendukung kebiasaan membaca siswa dan menjaga koleksi
            perpustakaan tetap rapi dan terawat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIBRARY_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.48, delay: idx * 0.08, ease: SMOOTH_EASE }}
                whileHover={{ y: -5 }}
                className="transform-gpu"
              >
                <Link
                  href={item.href}
                  className="group h-full rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border-subtle)] p-7 shadow-xs hover:shadow-md hover:border-[var(--accent-primary)]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-[var(--bg-primary)] text-[var(--accent-primary)] flex items-center justify-center mb-5 group-hover:bg-[var(--accent-primary)] group-hover:text-[#F6EFE6] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--text-primary)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
                    {item.linkLabel} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
