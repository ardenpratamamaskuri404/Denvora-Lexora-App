"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, RotateCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const STEPS = [
  {
    num: "1",
    title: "Buat Akun Anggota",
    desc: "Siswa mengisi nama lengkap, nomor induk, dan kelas untuk mengaktifkan keanggotaan perpustakaan.",
  },
  {
    num: "2",
    title: "Pilih & Pinjam Buku",
    desc: "Cari judul atau kategori bacaan yang tersedia di katalog, lalu ajukan peminjaman dengan satu klik.",
  },
  {
    num: "3",
    title: "Kembalikan Tepat Waktu",
    desc: "Pantau daftar buku yang sedang dibaca beserta batas waktu 7 hari, lalu kembalikan saat selesai.",
  },
];

const FLIP_CARDS = [
  {
    frontTitle: "KATALOG RAPI & MUDAH DIJELAJAHI",
    backText:
      "Koleksi bacaan dikelompokkan berdasarkan bidang studi, literasi fiksi, dan referensi agar siswa menemukan buku incaran lebih cepat.",
    bg: "bg-(--surface-elevated)",
  },
  {
    frontTitle: "PENCATATAN TERTIB & JELAS",
    backText:
      "Setiap peminjaman memiliki tanggal ambil serta batas pengembalian yang tertera jelas di riwayat keanggotaan masing-masing.",
    bg: "bg-(--bg-surface)",
  },
  {
    frontTitle: "PELAYANAN PERPUSTAKAAN PRAKTIS",
    backText:
      "Anggota dan pustakawan dapat memantau ketersediaan buku serta merapikan sirkulasi harian tanpa antrean panjang.",
    bg: "bg-(--surface-elevated)",
  },
];

export function FlowView() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  function toggleFlip(idx: number) {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <>
      <section className="relative bg-(--bg-primary) pt-32 pb-20 px-6 transition-colors overflow-hidden">
        <AmbientSparkles />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
                Panduan Peminjaman
              </p>
              <h1 className="font-editorial mt-2 text-4xl font-bold tracking-tight text-(--text-primary) sm:text-5xl">
                Tiga Langkah Mudah
              </h1>
              <p className="mt-2 text-sm text-(--text-muted) sm:text-base max-w-xl leading-relaxed">
                Dari pendaftaran kartu anggota hingga pengembalian buku, seluruh tahap
                dibuat ringkas agar Anda bisa langsung menikmati koleksi bacaan.
              </p>
            </div>
            <Button asChild size="pill">
              <Link href="/register">
                <Users size={16} strokeWidth={1.75} />
                Daftar Sebagai Anggota
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.08 }}
                transition={{ duration: 0.42, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-xs"
              >
                <span className="font-editorial flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary) text-xl font-bold text-[#F6EFE6] tabular-nums">
                  {step.num}
                </span>
                <div>
                  <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-(--text-muted)">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-(--border-subtle) bg-(--bg-surface)/80 py-20 px-6 transition-colors">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
              Keunggulan Layanan
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-(--text-primary) sm:text-4xl">
              Mengapa Membaca Bersama Denvora Lexora
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3" style={{ perspective: "1200px" }}>
            {FLIP_CARDS.map((card, idx) => {
              const isFlipped = Boolean(flipped[idx]);
              return (
                <button
                  key={card.frontTitle}
                  type="button"
                  onClick={() => toggleFlip(idx)}
                  aria-pressed={isFlipped}
                  className="group relative h-64 w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) rounded-2xl"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.48, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative h-full w-full"
                  >
                    <div
                      style={{ backfaceVisibility: "hidden" }}
                      className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-(--border-subtle) ${card.bg} p-7 shadow-sm`}
                    >
                      <h3 className="font-editorial text-xl font-bold leading-snug text-(--text-primary)">
                        {card.frontTitle}
                      </h3>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-primary) text-[#F6EFE6] transition-transform duration-150 group-hover:translate-x-1">
                        <ArrowRight size={17} strokeWidth={1.75} />
                      </span>
                    </div>

                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-(--accent-primary) bg-[#2B1D14] dark:bg-[#120C08] p-7 text-[#F6EFE6] shadow-md"
                    >
                      <p className="text-sm leading-relaxed text-[#F6EFE6]/90">
                        {card.backText}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E9DCCB]">
                        <RotateCw size={14} strokeWidth={1.75} />
                        Klik untuk kembali
                      </span>
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
