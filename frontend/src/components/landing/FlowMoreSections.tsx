"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CalendarCheck2, CheckSquare, Library, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const RETURN_STEPS = [
  {
    num: "01",
    title: "Periksa Kelengkapan Buku",
    desc: "Pastikan sampul bersih, pembatas tidak tertinggal, dan kondisi halaman tetap rapi sebelum dikembalikan.",
  },
  {
    num: "02",
    title: "Cek Jadwal Jatuh Tempo",
    desc: "Lihat tanggal batas kembali 7 hari di menu Riwayat Pinjaman pada akun anggota Anda.",
  },
  {
    num: "03",
    title: "Konfirmasi Pengembalian",
    desc: "Ajukan pengembalian melalui portal atau serahkan buku kepada pustakawan di meja layanan.",
  },
  {
    num: "04",
    title: "Siap Memilih Bacaan Baru",
    desc: "Setelah status kembali tercatat, stok buku otomatis tersedia lagi untuk pembaca berikutnya.",
  },
];

const BORROW_RULES = [
  {
    icon: CalendarCheck2,
    title: "Durasi Baca 7 Hari",
    desc: "Cukup untuk menyelesaikan satu buku fiksi maupun modul pengayaan pelajaran dengan santai.",
  },
  {
    icon: CheckSquare,
    title: "Tanggung Jawab Bersama",
    desc: "Menjaga buku tetap utuh membantu generasi siswa berikutnya merasakan bacaan yang sama baiknya.",
  },
  {
    icon: Library,
    title: "Tanpa Antrean Panjang",
    desc: "Pengecekan ketersediaan koleksi dan pencatatan pinjam dilakukan ringkas dalam hitungan detik.",
  },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FlowMoreSections() {
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
              Tahap Pengembalian
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Mengembalikan Buku Sama Mudahnya
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RETURN_STEPS.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.08 }}
                transition={{ duration: 0.42, delay: idx * 0.06, ease: SMOOTH_EASE }}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6"
              >
                <span className="font-editorial text-2xl font-bold text-[var(--accent-primary)] tabular-nums">
                  {item.num}
                </span>
                <h3 className="font-editorial mt-3 text-lg font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
                  {item.desc}
                </p>
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
              Ketentuan Singkat
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
              Tertib Membaca, Nyaman untuk Semua
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {BORROW_RULES.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.08 }}
                  transition={{ duration: 0.42, delay: idx * 0.07, ease: SMOOTH_EASE }}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-7"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-primary)]">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-editorial mt-4 text-xl font-bold text-[var(--text-primary)]">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {rule.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button asChild size="pill">
              <Link href="/register">
                <Sparkles size={16} strokeWidth={1.75} />
                Mulai Pinjam Buku
              </Link>
            </Button>
            <Button asChild variant="outline" size="pill">
              <Link href="/tentang">Baca Pertanyaan Umum</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
