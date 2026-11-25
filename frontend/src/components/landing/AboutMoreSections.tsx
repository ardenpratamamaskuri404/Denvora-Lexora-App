"use client";

import { motion } from "motion/react";
import { BookOpenCheck, Clock3, Compass, MapPin } from "lucide-react";

const MISSIONS = [
  "Menghadirkan katalog bacaan sekolah yang mudah dicari oleh setiap siswa dan guru.",
  "Menumbuhkan disiplin membaca serta tanggung jawab menjaga koleksi perpustakaan.",
  "Mendukung kegiatan belajar melalui referensi sains, sastra, dan sejarah yang terorganisir.",
];

const FACILITY_INFO = [
  {
    icon: Clock3,
    title: "Jam Layanan Sekolah",
    desc: "Senin–Kamis 07.30–15.30, Jumat 07.30–14.30, serta Sabtu 08.00–12.00 untuk kunjungan literasi.",
  },
  {
    icon: MapPin,
    title: "Zona Baca Nyaman",
    desc: "Tersedia meja baca individu, sudut diskusi kelompok kecil, dan rak koleksi tematik.",
  },
  {
    icon: BookOpenCheck,
    title: "Bantuan Pustakawan",
    desc: "Tim perpustakaan siap membantu rekomendasi bacaan dan pencatatan sirkulasi buku harian.",
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AboutMoreSections() {
  return (
    <>
      <section className="py-20 px-6 bg-[var(--bg-surface)]/80 border-t border-[var(--border-subtle)] transition-colors">
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.46, ease: SMOOTH_EASE }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-primary)] mb-4">
              <Compass size={20} strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Visi Literasi
            </p>
            <h2 className="font-editorial mt-2 text-2xl font-bold text-[var(--text-primary)]">
              Menjadikan Membaca Bagian dari Keseharian Sekolah
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              Kami percaya akses buku yang tertata rapi membuka rasa ingin tahu siswa lebih
              luas dan menciptakan budaya belajar yang mandiri sepanjang tahun ajaran.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.46, delay: 0.08, ease: SMOOTH_EASE }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Misi Perpustakaan
            </p>
            <h2 className="font-editorial mt-2 text-2xl font-bold text-[var(--text-primary)]">
              Komitmen Pelayanan Kami
            </h2>
            <ul className="mt-4 space-y-3">
              {MISSIONS.map((item, idx) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                >
                  <span className="font-editorial inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)] text-xs font-bold text-[#F6EFE6] tabular-nums">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] transition-colors">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.46, ease: SMOOTH_EASE }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Lingkungan Perpustakaan
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Kenyamanan Membaca di Sekolah
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {FACILITY_INFO.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.08 }}
                  transition={{ duration: 0.42, delay: idx * 0.07, ease: SMOOTH_EASE }}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
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
    </>
  );
}
