"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Minus, Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const FAQS = [
  {
    q: "Bagaimana cara siswa baru meminjam buku?",
    a: "Klik Daftar Anggota di halaman utama atau login, isi nama, NIS, kelas, username, dan password. Setelah akun dibuat, masuk ke dashboard siswa untuk meminjam buku.",
  },
  {
    q: "Apa perbedaan hak akses Petugas dan Admin?",
    a: "Admin memiliki kendali penuh termasuk menghapus buku/kategori serta mengelola akun anggota dan petugas. Petugas fokus membantu operasional buku, transaksi, ekspor CSV, dan melihat daftar anggota.",
  },
  {
    q: "Berapa lama batas waktu peminjaman buku?",
    a: "Setiap peminjaman otomatis menetapkan tanggal jatuh tempo 7 hari sejak tanggal pinjam sebagai penanda informasi keterlambatan tanpa perhitungan denda uang.",
  },
  {
    q: "Apakah aplikasi bisa dijalankan tanpa koneksi internet?",
    a: "Ya. Seluruh aset ilustrasi, video, font sistem, API Express, dan database MySQL berjalan secara lokal di localhost.",
  },
];

export function FlipCardsAndFaqSection() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function toggleFlip(idx: number) {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <>
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

      <section className="bg-[#A8643A] py-20 px-6 text-[#F6EFE6]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-editorial text-center text-3xl font-bold sm:text-4xl">
            Pertanyaan Umum. Kami Menjawab.
          </h2>

          <div className="mt-10 space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-[#D7C7B4]/40 bg-[#FBF7F1] text-[#2B1D14]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold cursor-pointer hover:bg-[#E9DCCB]/45"
                  >
                    <span className="text-sm sm:text-base">{item.q}</span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A8643A] text-[#F6EFE6]">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#D7C7B4] px-5 py-4 text-sm leading-relaxed text-[#2B1D14]/85">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F6EFE6] py-16 px-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#D7C7B4] bg-[#E9DCCB] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Siap Memulai?
            </p>
            <h2 className="font-editorial mt-1.5 text-2xl font-bold text-[#2B1D14] sm:text-3xl">
              Akses Perpustakaan Digital Denvora Lexora Sekarang.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild size="pill">
              <Link href="/register">Daftar Anggota</Link>
            </Button>
            <Button asChild variant="outline" size="pill">
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer id="tentang" className="border-t border-[#D7C7B4] bg-[#E9DCCB] py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover border border-[#D7C7B4]"
            />
            <div>
              <p className="font-editorial text-lg font-bold text-[#2B1D14]">Denvora Lexora</p>
              <p className="text-xs text-[#8C7B6B]">
                Where Knowledge Finds Its Way · Digital Library System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#2B1D14]">
            <Link href="/login" className="hover:text-[#A8643A]">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[#A8643A]">
              Daftar Anggota
            </Link>
            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#A8643A]"
            >
              Swagger API
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
