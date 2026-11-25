"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENTO_ITEMS = [
  {
    icon: Search,
    title: "Pencarian Koleksi Cepat",
    desc: "Temukan bahan bacaan berdasarkan judul, nama penulis, kategori rak, maupun ketersediaan eksemplar.",
  },
  {
    icon: BookOpen,
    title: "Status Rak Selalu Akurat",
    desc: "Informasi jumlah buku tersedia langsung diperbarui setiap kali peminjaman dan pengembalian selesai.",
  },
  {
    icon: Clock,
    title: "Masa Pinjam Terjadwal",
    desc: "Batas waktu baca 7 hari tercatat jelas sejak hari pengambilan agar sirkulasi buku tetap lancar.",
  },
  {
    icon: Layers,
    title: "Riwayat Bacaan Pribadi",
    desc: "Anggota dapat memantau buku yang sedang dipinjam maupun daftar bacaan yang telah dikembalikan.",
  },
];

const PREVIEW_CARDS = [
  {
    tag: "Pendaftaran",
    title: "Aktivasi Kartu Anggota",
    image: "/images/denvora-register-web.svg",
    tilt: "md:-rotate-2",
    tone: "bg-[#FBF7F1]",
  },
  {
    tag: "Portal Baca",
    title: "Akses Akun Perpustakaan",
    image: "/images/denvora-login-web.svg",
    tilt: "md:rotate-0 md:-translate-y-2",
    tone: "bg-[#E9DCCB]",
  },
  {
    tag: "Koleksi Rak",
    title: "Eksplorasi & Peminjaman",
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
              Layanan Perpustakaan
            </p>
            <h1 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-5xl">
              Dirancang untuk kebiasaan membaca yang tertib.
            </h1>
            <p className="mt-3 text-base text-[#8C7B6B] leading-relaxed">
              Setiap layanan kami hadir agar siswa lebih mudah menemukan literatur bermutu
              dan proses pinjam-kembali berjalan nyaman setiap hari.
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
                  Layanan Terpadu
                </span>
                <h2 className="font-editorial mt-4 text-2xl font-bold text-[#2B1D14]">
                  Katalog terbuka, sirkulasi buku lebih teratur.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#2B1D14]/80">
                  Dari penelusuran judul buku hingga pencatatan pengembalian di ruang baca,
                  seluruh aktivitas literasi sekolah terangkum dengan rapi.
                </p>
              </div>
              <div className="relative h-56 w-full border-t border-[#D7C7B4]">
                <Image
                  src="/images/denvora-landing-hero.svg"
                  alt="Koleksi Perpustakaan Denvora Lexora"
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
            Kemudahan Anggota
          </p>
          <h2 className="font-editorial mt-2 text-3xl font-bold text-[#2B1D14] sm:text-4xl">
            Pengalaman Membaca dari Pendaftaran hingga Pengembalian
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PREVIEW_CARDS.map((card, idx) => (
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A8643A]">
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
                Lihat Panduan Peminjaman
                <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
