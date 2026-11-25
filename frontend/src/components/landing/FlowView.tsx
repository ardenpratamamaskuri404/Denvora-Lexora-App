"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, RotateCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    num: "1",
    title: "Daftar Anggota",
    desc: "Siswa baru mengisi nama, NIS, kelas, dan membuat akun secara mandiri sebelum login.",
  },
  {
    num: "2",
    title: "Pilih & Pinjam Buku",
    desc: "Cari judul atau kategori buku tersedia, konfirmasi pinjaman, dan simpan kode transaksi.",
  },
  {
    num: "3",
    title: "Kembalikan Tepat Waktu",
    desc: "Pantau daftar pinjaman aktif dan kembalikan buku dari menu pengembalian kapan saja.",
  },
];

const FLIP_CARDS = [
  {
    frontTitle: "ALUR JELAS & SESUAI STANDAR UKK",
    backText:
      "Seluruh menu Admin dan Siswa dibangun selaras dengan flowmap resmi: daftar anggota, login tervalidasi, peminjaman, pengembalian, dan CRUD terstruktur.",
    bg: "bg-[#FBF7F1]",
  },
  {
    frontTitle: "AMAN & CEPAT DI LOCALHOST",
    backText:
      "Berjalan penuh secara lokal tanpa ketergantungan internet. Password ter-hash bcryptjs, input divalidasi Zod, dan tiap endpoint dilindungi RBAC.",
    bg: "bg-[#E9DCCB]",
  },
  {
    frontTitle: "STOK & LAPORAN AKURAT",
    backText:
      "Transaksi peminjaman mengunci stok secara atomik di MySQL agar tidak bentrok, lengkap dengan indikator jatuh tempo dan ekspor laporan CSV.",
    bg: "bg-[#FBF7F1]",
  },
];

export function FlowView() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  function toggleFlip(idx: number) {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <>
      <section className="bg-[#F6EFE6] pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
                Halaman Alur Sistem
              </p>
              <h1 className="font-editorial mt-2 text-4xl font-bold tracking-tight text-[#2B1D14] sm:text-5xl">
                3 LANGKAH MUDAH
              </h1>
              <p className="mt-2 text-sm text-[#8C7B6B] sm:text-base max-w-xl">
                Mengikuti alur resmi flowmap siswa dari pendaftaran anggota hingga
                pengembalian buku, terhubung langsung dengan layanan Admin dan Petugas.
              </p>
            </div>
            <Button asChild size="pill">
              <Link href="/register">
                <Users size={16} strokeWidth={1.75} />
                Mulai Daftar Sekarang
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-[#D7C7B4] bg-[#FBF7F1] p-6 shadow-xs"
              >
                <span className="font-editorial flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A8643A] text-xl font-bold text-[#F6EFE6] tabular-nums">
                  {step.num}
                </span>
                <div>
                  <h2 className="font-editorial text-lg font-bold text-[#2B1D14]">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#8C7B6B]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#D7C7B4] bg-[#E9DCCB]/75 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Klik Kartu Untuk Detail
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-4xl">
              Mengapa Memilih Denvora Lexora
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
                  className="group relative h-64 w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8643A] rounded-2xl"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.48, ease: "easeOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative h-full w-full"
                  >
                    <div
                      style={{ backfaceVisibility: "hidden" }}
                      className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-[#D7C7B4] ${card.bg} p-7 shadow-sm`}
                    >
                      <h3 className="font-editorial text-xl font-bold leading-snug text-[#2B1D14]">
                        {card.frontTitle}
                      </h3>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A8643A] text-[#F6EFE6] transition-transform duration-150 group-hover:translate-x-1">
                        <ArrowRight size={17} strokeWidth={1.75} />
                      </span>
                    </div>

                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-[#A8643A] bg-[#2B1D14] p-7 text-[#F6EFE6] shadow-md"
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
