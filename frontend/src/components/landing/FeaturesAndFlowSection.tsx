"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BookMarked, ClipboardCheck, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_CARDS = [
  {
    role: "Siswa / Anggota",
    badge: "Wajib UKK",
    icon: BookMarked,
    summary:
      "Mendaftar mandiri, mencari buku tersedia berdasarkan judul atau kategori, meminjam, dan mengembalikan buku.",
  },
  {
    role: "Petugas Layanan",
    badge: "Operasional",
    icon: ClipboardCheck,
    summary:
      "Membantu sirkulasi peminjaman harian, memperbarui katalog buku, melihat daftar anggota, serta ekspor laporan CSV.",
  },
  {
    role: "Admin Perpustakaan",
    badge: "Kendali Penuh",
    icon: ShieldCheck,
    summary:
      "Mengelola penuh data buku, kategori, anggota siswa, akun petugas, dan seluruh riwayat transaksi.",
  },
];

const FLOW_STEPS = [
  {
    num: "01",
    title: "Daftar Anggota",
    desc: "Siswa baru membuat akun dengan NIS dan kelas untuk mendapatkan akses peminjaman.",
  },
  {
    num: "02",
    title: "Cari & Pinjam Buku",
    desc: "Filter katalog sesuai kategori atau ketersediaan stok, lalu konfirmasi peminjaman.",
  },
  {
    num: "03",
    title: "Kembalikan Tepat Waktu",
    desc: "Pantau jatuh tempo pinjaman dan selesaikan pengembalian sehingga stok langsung pulih.",
  },
];

export function FeaturesAndFlowSection() {
  return (
    <>
      <section id="fitur" className="bg-[#E9DCCB]/55 py-20 px-6 border-y border-[#D7C7B4]">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Hak Akses Terstruktur
            </p>
            <h2 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-4xl">
              Satu sistem untuk seluruh peran perpustakaan.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLE_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.role}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="rounded-xl border border-[#D7C7B4] bg-[#FBF7F1] p-6 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={22} strokeWidth={1.75} className="text-[#A8643A]" />
                    <span className="text-xs font-medium text-[#8C7B6B]">{card.badge}</span>
                  </div>
                  <h3 className="font-editorial mt-4 text-xl font-bold text-[#2B1D14]">
                    {card.role}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2B1D14]/80">
                    {card.summary}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="alur" className="bg-[#F6EFE6] py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
                Alur Resmi Siswa
              </p>
              <h2 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-4xl">
                Tiga langkah sederhana meminjam buku.
              </h2>
            </div>
            <Button asChild variant="outline" size="pill">
              <Link href="/register">
                <Users size={16} strokeWidth={1.75} />
                Mulai Daftar Sekarang
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FLOW_STEPS.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-xl border border-[#D7C7B4] bg-[#FBF7F1] p-6"
              >
                <span className="font-mono text-sm font-bold text-[#A8643A] tabular-nums">
                  {step.num}
                </span>
                <h3 className="font-editorial mt-2 text-xl font-bold text-[#2B1D14]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8C7B6B]">{step.desc}</p>
              </motion.div>
            ))}
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
                Where Knowledge Finds Its Way · Localhost Digital Library
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
