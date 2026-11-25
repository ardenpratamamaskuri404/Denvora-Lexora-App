"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Code2, GitBranch, ShieldCheck } from "lucide-react";

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

const INFO_LINKS: FooterLinkItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Fitur Sistem", href: "/fitur" },
  { label: "Alur Pinjam", href: "/alur" },
  { label: "Tentang & FAQ", href: "/tentang" },
];

const GETTING_STARTED_LINKS: FooterLinkItem[] = [
  { label: "Daftar Anggota", href: "/register" },
  { label: "Masuk ke Sistem", href: "/login" },
  { label: "Portal Siswa", href: "/login?role=siswa" },
  { label: "Portal Admin & Petugas", href: "/login?role=staff" },
];

const RESOURCE_LINKS: FooterLinkItem[] = [
  { label: "Swagger API Docs", href: "http://localhost:5000/api-docs", external: true },
  { label: "Status Server API", href: "http://localhost:5000/api/health", external: true },
  { label: "Hak Akses & Peran", href: "/fitur" },
  { label: "Panduan Pengguna", href: "/alur" },
];

function FooterColumn({ title, items }: { title: string; items: FooterLinkItem[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-[#E9DCCB]/80">
        {items.map((item) => (
          <li key={item.label}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#A8643A]"
              >
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-[#A8643A]">
                {item.label}
              </Link>
            )}
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
          <FooterColumn title="Info" items={INFO_LINKS} />
          <FooterColumn title="Mulai Cepat" items={GETTING_STARTED_LINKS} />
          <FooterColumn title="Sumber Daya" items={RESOURCE_LINKS} />

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#F6EFE6]">
              Cari Katalog Cepat
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-[#E9DCCB]/75">
              Masukkan judul buku atau kata kunci untuk langsung mencari koleksi setelah masuk
              ke portal Denvora Lexora.
            </p>
            <form onSubmit={handleQuickSearch} className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Judul buku..."
                aria-label="Cari judul buku"
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
              <a
                href="https://github.com/ardenpratamamaskuri404/Denvora-Lexora-App"
                target="_blank"
                rel="noreferrer"
                aria-label="Repositori GitHub"
                className="hover:text-[#A8643A]"
              >
                <GitBranch size={17} strokeWidth={1.75} />
              </a>
              <a
                href="http://localhost:5000/api-docs"
                target="_blank"
                rel="noreferrer"
                aria-label="Dokumentasi API Swagger"
                className="hover:text-[#A8643A]"
              >
                <Code2 size={17} strokeWidth={1.75} />
              </a>
              <Link href="/tentang" aria-label="Tentang & Keamanan" className="hover:text-[#A8643A]">
                <ShieldCheck size={17} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#8C7B6B]/25 pt-6 text-xs text-[#8C7B6B]">
          <p>Denvora Lexora — Where Knowledge Finds Its Way.</p>
          <p>© 2026 Arden Pratama Maskuri · All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
