/**
 * @module components/landing/SiteFooter
 * @description Footer 4 kolom Cream Mocha penuh hingga sudut layar dengan live search katalog buku.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Compass, HelpCircle, Loader2, Search } from "lucide-react";
import { meApi, searchPublicBooksApi } from "@/lib/api";
import { getDashboardPath, type CatalogBookItem } from "@/types/auth";

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
            <Link href={item.href} className="transition-colors hover:text-[#C87E4F]">
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
  const [results, setResults] = useState<CatalogBookItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  function handleKeywordChange(nextValue: string) {
    setKeyword(nextValue);
    if (!nextValue.trim()) {
      setResults([]);
      setShowResults(false);
    }
  }

  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchPublicBooksApi(trimmed, 5);
        setResults(res.data || []);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [keyword]);

  async function navigateWithSearch(targetQuery: string) {
    const q = targetQuery.trim();
    setShowResults(false);
    try {
      const me = await meApi();
      const user = me.data?.user;
      if (user) {
        const base = getDashboardPath(user.role);
        router.push(q ? `${base}?search=${encodeURIComponent(q)}` : base);
        return;
      }
    } catch {
      // Belum login: arahkan ke halaman masuk sambil membawa kata kunci pencarian.
    }
    router.push(q ? `/login?search=${encodeURIComponent(q)}` : "/login");
  }

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    void navigateWithSearch(keyword);
  }

  return (
    <footer className="bg-[#2B1D14] dark:bg-[#120C08] text-[#F6EFE6] border-t border-[#8C7B6B]/30">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-14 py-12 sm:py-14">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8C7B6B]/25 pb-8">
          <Link
            href="/"
            aria-label="Beranda Denvora Lexora"
            className="inline-flex w-fit items-center overflow-hidden h-12 sm:h-14 rounded-2xl bg-[#FBF7F1] px-4 shadow-xs"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={320}
              height={213}
              className="h-[80px] sm:h-[90px] w-auto object-contain mix-blend-multiply"
            />
          </Link>
          <p className="text-sm text-[#E9DCCB]/80 max-w-md sm:text-right">
            Ruang literasi digital sekolah untuk mengakses katalog bacaan dan layanan
            peminjaman buku dengan nyaman.
          </p>
        </div>

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

          <div className="relative">
            <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">
              Cari Koleksi Buku
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-[#E9DCCB]/75">
              Ketik judul buku atau penulis untuk melihat ketersediaan koleksi secara live.
            </p>
            <form onSubmit={handleQuickSearch} className="mt-4 flex items-center gap-2 relative">
              <div className="relative w-full min-w-0">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  onFocus={() => results.length > 0 && setShowResults(true)}
                  placeholder="Judul atau penulis..."
                  aria-label="Cari judul buku atau penulis"
                  className="h-10 w-full rounded-md border border-[#8C7B6B]/60 bg-transparent pl-3 pr-8 text-sm text-[#F6EFE6] placeholder:text-[#8C7B6B] focus:border-[#C87E4F] focus:outline-none"
                />
                {searching ? (
                  <Loader2 size={14} className="animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-[#C87E4F]" />
                ) : (
                  <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7B6B]" />
                )}
              </div>
              <button
                type="submit"
                className="h-10 shrink-0 rounded-md bg-[#F6EFE6] px-4 text-xs font-bold uppercase tracking-wider text-[#2B1D14] transition-colors hover:bg-[#E9DCCB] cursor-pointer"
              >
                Cari
              </button>
            </form>

            {showResults && keyword.trim() && (
              <div className="mt-2 rounded-xl border border-[#8C7B6B]/40 bg-[#1B110B] p-2 shadow-xl">
                {results.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-[#C2B09E]">
                    Buku dengan kata kunci &ldquo;{keyword.trim()}&rdquo; tidak ditemukan.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#8C7B6B]/20 max-h-56 overflow-y-auto">
                    {results.map((book) => (
                      <li key={book.id}>
                        <button
                          type="button"
                          onClick={() => void navigateWithSearch(book.title)}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#2E2017] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#F6EFE6] truncate">
                              {book.title}
                            </p>
                            <p className="text-[11px] text-[#C2B09E] truncate">
                              {book.author} · {book.shelf_location || book.category_name}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              book.stock_available > 0
                                ? "bg-[#2F6B48]/30 text-[#9FE0B7]"
                                : "bg-[#9E3B33]/30 text-[#F5ACA6]"
                            }`}
                          >
                            {book.stock_available > 0 ? `Stok ${book.stock_available}` : "Habis"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center gap-4 text-[#E9DCCB]/80">
              <Link href="/" aria-label="Beranda Denvora Lexora" className="hover:text-[#C87E4F]">
                <BookOpen size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/fitur" aria-label="Layanan Perpustakaan" className="hover:text-[#C87E4F]">
                <Compass size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/alur" aria-label="Panduan Peminjaman" className="hover:text-[#C87E4F]">
                <Clock size={17} strokeWidth={1.75} />
              </Link>
              <Link href="/tentang" aria-label="Tentang & FAQ" className="hover:text-[#C87E4F]">
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
