"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Compass, HelpCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/fitur" },
  { label: "Panduan", href: "/alur" },
  { label: "Tentang Kami", href: "/tentang" },
];

const MEMBER_LINKS = [
  { label: "Daftar Anggota", href: "/register" },
  { label: "Masuk ke Portal", href: "/login" },
  { label: "Cara Meminjam Buku", href: "/alur" },
  { label: "Pertanyaan Umum", href: "/tentang#faq" },
];

const SERVICE_HOURS = [
  "Senin – Kamis · 07.30 – 15.30",
  "Jumat · 07.30 – 14.30",
  "Sabtu · 08.00 – 12.00",
  "Gedung Perpustakaan Sekolah",
];

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-[#E9DCCB]/80">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="transition-colors hover:text-[#A8643A]">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = keyword.trim();
    router.push(query ? `/login?search=${encodeURIComponent(query)}` : "/login");
  }

  return (
    <footer className="bg-[#2B1D14] text-[#F6EFE6] border-t border-[#8C7B6B]/30">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Navigasi" items={NAV_LINKS} />
          <FooterColumn title="Layanan Anggota" items={MEMBER_LINKS} />

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">
              Jam Layanan
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#E9DCCB]/80">
              {SERVICE_HOURS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">
              Cari Koleksi Buku
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-[#E9DCCB]/75">
              Masukkan judul buku atau kata kunci untuk menelusuri koleksi bacaan di
              portal Denvora Lexora.
            </p>
            <form onSubmit={handleQuickSearch} className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Judul atau penulis..."
                aria-label="Cari judul buku atau penulis"
                className="h-10 w-full min-w-0 rounded-md border border-[#8C7B6B]/60 bg-transparent px-3 text-sm text-[#F6EFE6] placeholder:text-[#8C7B6B] focus:border-[#A8643A] focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-md bg-[#F6EFE6] px-4 text-xs font-bold uppercase tracking-wider text-[#2B1D14] transition-colors hover:bg-[#E9DCCB] cursor-pointer"
              >
                Cari
              </button>
            </form>

            <div className="mt-5 flex items-center gap-4 text-[#E9DCCB]/80">
              <Link href="/" aria-label="Beranda Denvora Lexora" className="hover:text-[#A8643A]">
                <BookOpen size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/fitur" aria-label="Layanan Perpustakaan" className="hover:text-[#A8643A]">
                <Compass size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/alur" aria-label="Panduan Peminjaman" className="hover:text-[#A8643A]">
                <Clock size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/tentang" aria-label="Tentang & FAQ" className="hover:text-[#A8643A]">
                <HelpCircle size={17} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#8C7B6B]/25 pt-6 text-xs text-[#8C7B6B]">
          <p>Denvora Lexora — Where Knowledge Finds Its Way.</p>
          <p>© 2026 Perpustakaan Digital Denvora Lexora.</p>
        </div>
      </div>
    </footer>
  );
}
