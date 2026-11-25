"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock, FileSpreadsheet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENTO_ITEMS = [
  {
    icon: Search,
    title: "Pencarian Kondisi Tertentu",
    desc: "Filter katalog berdasarkan judul, pengarang, kode buku, kategori, serta ketersediaan stok.",
  },
  {
    icon: BookOpen,
    title: "Stok Atomik & Konsisten",
    desc: "Pengurangan dan pemulihan stok memakai penguncian transaksi SQL agar tidak pernah minus.",
  },
  {
    icon: Clock,
    title: "Pelacakan Jatuh Tempo",
    desc: "Setiap peminjaman mencatat jatuh tempo 7 hari dan penanda keterlambatan secara otomatis.",
  },
  {
    icon: FileSpreadsheet,
    title: "Ekspor Laporan CSV",
    desc: "Admin dan Petugas dapat mengunduh rekap transaksi CSV langsung dari server lokal.",
  },
];

const TILTED_CARDS = [
  {
    tag: "01 · Keanggotaan",
    title: "Daftar Anggota Mandiri",
    image: "/images/denvora-register-web.svg",
    tilt: "md:-rotate-2",
    tone: "bg-[#FBF7F1]",
  },
  {
    tag: "02 · Otorisasi Peran",
    title: "Masuk Sesuai Hak Akses",
    image: "/images/denvora-login-web.svg",
    tilt: "md:rotate-0 md:-translate-y-2",
    tone: "bg-[#E9DCCB]",
  },
  {
    tag: "03 · Sirkulasi",
    title: "Pinjam & Kembalikan Buku",
    image: "/images/denvora-landing-hero.svg",
    tilt: "md:rotate-2",
    tone: "bg-[#FBF7F1]",
  },
];

export function FeaturesView() {
  return (
    <>
      <section className="bg-[#F6EFE6] pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
              Halaman Fitur Sistem
            </p>
            <h1 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-5xl">
              Dirancang untuk kebiasaan membaca yang tertib.
            </h1>
            <p className="mt-3 text-base text-[#8C7B6B]">
              Seluruh modul frontend dan REST API backend dipisahkan tegas sesuai peran
              Siswa, Petugas, dan Admin.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D7C7B4] bg-[#E9DCCB] lg:row-span-2"
            >
              <div className="p-6">
                <span className="inline-block rounded-full bg-[#A8643A] px-3 py-1 text-xs font-semibold text-[#F6EFE6]">
                  3 Peran Terintegrasi
                </span>
                <h2 className="font-editorial mt-4 text-2xl font-bold text-[#2B1D14]">
                  Admin, Petugas, dan Siswa dalam satu alur.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#2B1D14]/80">
                  Admin memegang kendali penuh master data, Petugas menangani sirkulasi
                  harian, dan Siswa fokus pada peminjaman serta pengembalian buku.
                </p>
              </div>
              <div className="relative h-56 w-full border-t border-[#D7C7B4]">
                <Image
                  src="/images/denvora-landing-hero.svg"
                  alt="Katalog Digital Denvora Lexora"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover object-right"
                />
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
              {BENTO_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="rounded-2xl border border-[#D7C7B4] bg-[#FBF7F1] p-6 shadow-xs transition-colors hover:border-[#A8643A]/60"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9DCCB] text-[#A8643A]">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <h3 className="font-editorial mt-4 text-lg font-bold text-[#2B1D14]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#8C7B6B]">{item.desc}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D7C7B4] bg-[#E9DCCB]/60 py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8643A]">
            Antarmuka Setiap Tahap
          </p>
          <h2 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-4xl">
            Pengelolaan Perpustakaan Jadi Lebih Jelas
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TILTED_CARDS.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`group rounded-2xl border border-[#D7C7B4] ${card.tone} p-4 shadow-[0_14px_32px_rgba(43,29,20,0.08)] transition-transform duration-200 ${card.tilt} md:hover:rotate-0 md:hover:-translate-y-2`}
              >
                <div className="overflow-hidden rounded-xl border border-[#D7C7B4] bg-[#F6EFE6]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={480}
                    height={320}
                    className="h-52 w-full object-cover object-top"
                  />
                </div>
                <div className="pt-4 pb-1 text-left">
                  <span className="font-mono text-xs font-semibold text-[#A8643A]">
                    {card.tag}
                  </span>
                  <h3 className="font-editorial mt-1 text-lg font-bold text-[#2B1D14]">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button asChild size="pill">
              <Link href="/alur">
                Lihat Alur Penggunaan
                <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
