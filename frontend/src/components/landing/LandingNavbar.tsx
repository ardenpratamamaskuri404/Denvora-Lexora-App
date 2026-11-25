"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Cerita", href: "#cerita" },
  { label: "Fitur", href: "#fitur" },
  { label: "Alur", href: "#alur" },
  { label: "Tentang", href: "#tentang" },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto max-w-6xl rounded-full border border-[#D7C7B4] bg-[#FBF7F1]/95 px-4 py-2.5 shadow-[0_8px_28px_rgba(43,29,20,0.08)] backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover border border-[#D7C7B4]"
            />
            <div className="leading-tight">
              <span className="font-editorial block text-base font-bold tracking-tight text-[#2B1D14]">
                Denvora Lexora
              </span>
              <span className="block text-[11px] font-medium text-[#8C7B6B]">
                Perpustakaan Digital
              </span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2B1D14]">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors duration-150 hover:text-[#A8643A]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Button asChild variant="outline" size="sm" className="rounded-full px-4">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/register">Daftar Anggota</Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D7C7B4] text-[#2B1D14] hover:bg-[#E9DCCB]"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-[#D7C7B4] flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#2B1D14] hover:bg-[#E9DCCB]"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 rounded-full">
                <Link href="/register">Daftar Anggota</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
