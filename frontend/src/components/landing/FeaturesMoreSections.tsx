"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookCheck, CheckCircle2, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICE_TRACKS = [
  {
    badge: "Untuk Siswa & Anggota",
    title: "Menemukan & Meminjam Lebih Praktis",
    points: [
      "Mencari judul buku atau penulis tanpa menyusuri satu per satu rak",
      "Mengetahui ketersediaan eksemplar sebelum datang ke meja layanan",
      "Melihat jadwal kembali 7 hari serta riwayat bacaan pribadi kapan saja",
    ],
  },
  {
    badge: "Untuk Pustakawan & Pengelola",
    title: "Merapikan Sirkulasi Buku Harian",
    points: [
      "Pencatatan peminjaman dan pengembalian tersusun rapi dan konsisten",
      "Pemantauan koleksi yang sedang dipinjam maupun jatuh tempo lebih jelas",
      "Pengelompokan kategori bacaan serta kondisi stok selalu terbarui",
    ],
  },
];

const READING_ETHICS = [
  {
    icon: BookCheck,
    title: "Kondisi Buku Terjaga",
    desc: "Setiap buku diperiksa kelayakannya sebelum dan sesudah masa pinjam berakhir.",
  },
  {
    icon: ClipboardCheck,
    title: "Jadwal Pengembalian Jelas",
    desc: "Tenggat 7 hari membantu setiap siswa bergiliran menikmati buku populer.",
  },
  {
    icon: ShieldCheck,
    title: "Data Anggota Terlindungi",
    desc: "Identitas keanggotaan tersimpan tertib sesuai data kelas di lingkungan sekolah.",
  },
  {
    icon: Sparkles,
    title: "Suasana Literasi Nyaman",
    desc: "Layanan cepat meminimalkan antrean sehingga waktu istirahat lebih optimal untuk membaca.",
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FeaturesMoreSections() {
  return (
    <>
      <section className="py-20 px-6 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] transition-colors">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.48, ease: SMOOTH_EASE }}
            className="max-w-2xl mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Manfaat Menyeluruh
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Mendukung Seluruh Warga Sekolah
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {SERVICE_TRACKS.map((track, idx) => (
              <motion.div
                key={track.badge}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.08 }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: SMOOTH_EASE }}
                className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8 shadow-xs"
              >
                <span className="inline-block rounded-full bg-[var(--bg-surface)] px-3.5 py-1 text-xs font-semibold text-[var(--accent-primary)]">
                  {track.badge}
                </span>
                <h3 className="font-editorial mt-4 text-2xl font-bold text-[var(--text-primary)]">
                  {track.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {track.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-muted)]"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-[var(--accent-primary)]"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[var(--bg-surface)]/75 border-t border-[var(--border-subtle)] transition-colors">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.48, ease: SMOOTH_EASE }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              Standar Kenyamanan
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Etika & Kualitas Ruang Baca
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {READING_ETHICS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.08 }}
                  transition={{ duration: 0.42, delay: idx * 0.06, ease: SMOOTH_EASE }}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-primary)]">
                    <Icon size={19} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-editorial mt-4 text-base font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center gap-3">
            <Button asChild size="pill">
              <Link href="/register">Aktifkan Kartu Anggota</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
