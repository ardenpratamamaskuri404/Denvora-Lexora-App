"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const FAQS = [
  {
    q: "Bagaimana cara mendaftar menjadi anggota perpustakaan?",
    a: "Klik tombol Daftar Anggota, isi nama lengkap, nomor induk siswa, kelas, serta detail akun Anda. Setelah terdaftar, Anda langsung dapat masuk dan memilih buku.",
  },
  {
    q: "Berapa lama batas waktu peminjaman setiap buku?",
    a: "Masa peminjaman standar berlaku selama 7 hari terhitung sejak tanggal peminjaman, sehingga koleksi tetap bergilir dengan merata bagi seluruh pembaca.",
  },
  {
    q: "Bagaimana jika stok buku yang ingin dipinjam sedang habis?",
    a: "Informasi jumlah stok tampil pada katalog. Apabila seluruh eksemplar sedang dipinjam, Anda dapat memeriksa kembali secara berkala atau memilih judul lain di kategori serupa.",
  },
  {
    q: "Di mana anggota bisa memantau daftar pinjaman aktif?",
    a: "Setelah masuk melalui portal anggota, seluruh daftar buku yang sedang dipinjam beserta tanggal pengembaliannya dapat dilihat pada riwayat pinjaman.",
  },
];

export function AboutFaqView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <section className="relative bg-(--bg-primary) pt-32 pb-16 px-6 transition-colors overflow-hidden">
        <AmbientSparkles />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-5xl grid gap-10 md:grid-cols-[1fr_auto] items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
              Tentang Denvora Lexora
            </p>
            <h1 className="font-editorial mt-2 text-3xl font-bold text-(--text-primary) sm:text-5xl">
              Where Knowledge Finds Its Way.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-(--text-primary)/80">
              <strong>Denvora Lexora</strong> hadir sebagai pusat literasi digital sekolah
              yang membantu siswa menemukan referensi belajar, menumbuhkan kebiasaan membaca,
              serta menjaga keteraturan koleksi perpustakaan setiap hari.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="pill">
                <Link href="/register">Daftar Anggota</Link>
              </Button>
              <Button asChild variant="outline" size="pill">
                <Link href="/login">Masuk ke Portal</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto rounded-2xl border border-(--border-subtle) bg-[#FBF7F1] px-7 py-5 shadow-xs">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={280}
              height={186}
              className="w-56 sm:w-64 h-auto object-contain mix-blend-multiply"
            />
          </div>
        </motion.div>
      </section>

      <section id="faq" className="bg-[#A8643A] dark:bg-(--bg-surface) py-20 px-6 text-[#F6EFE6] transition-colors">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-editorial text-center text-3xl font-bold sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="mt-10 space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--text-primary)"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold cursor-pointer hover:bg-(--bg-surface)/60"
                  >
                    <span className="text-sm sm:text-base">{item.q}</span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-primary) text-[#F6EFE6]">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-(--border-subtle) px-5 py-4 text-sm leading-relaxed text-(--text-muted)">
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
