"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function AboutFaqView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section className="bg-[#F6EFE6] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Tentang Denvora Lexora
            </p>
            <h1 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-5xl">
              Where Knowledge Finds Its Way.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#2B1D14]/80">
              <strong>Denvora Lexora</strong> adalah aplikasi Perpustakaan Sekolah Digital
              yang memisahkan antarmuka Next.js, REST API Express TypeScript, dan basis
              data MySQL secara rapi untuk mendukung pembelajaran serta administrasi
              peminjaman buku di lingkungan sekolah.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="pill">
                <Link href="/register">Daftar Anggota</Link>
              </Button>
              <Button asChild variant="outline" size="pill">
                <Link href="/login">Masuk ke Sistem</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto rounded-2xl border border-[#D7C7B4] bg-[#FBF7F1] px-7 py-5">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={280}
              height={186}
              className="w-56 sm:w-64 h-auto object-contain mix-blend-multiply"
            />
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
    </>
  );
}
