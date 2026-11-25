"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Fitur", href: "/fitur" },
  { label: "Alur", href: "/alur" },
  { label: "Tentang", href: "/tentang" },
];

function AuthButtons({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "flex gap-2 pt-2" : "hidden md:flex items-center gap-2.5 shrink-0"}>
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn("rounded-full", mobile ? "flex-1" : "px-4")}
      >
        <Link href="/login">Masuk</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={cn("rounded-full", mobile ? "flex-1" : "px-5")}
      >
        <Link href="/register">Daftar Anggota</Link>
      </Button>
    </div>
  );
}

export function LandingNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto max-w-6xl rounded-full border border-[#D7C7B4] bg-[#FBF7F1]/95 px-4 py-2.5 shadow-[0_8px_28px_rgba(43,29,20,0.08)] backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Beranda Denvora Lexora" className="flex items-center shrink-0 pl-1">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Denvora Lexora — Where Knowledge Finds Its Way."
              width={240}
              height={160}
              priority
              className="h-10 sm:h-11 w-auto object-contain mix-blend-multiply"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-2 text-sm font-medium text-[#2B1D14]">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-1.5 transition-colors duration-150",
                      active
                        ? "bg-[#E9DCCB] font-semibold text-[#A8643A]"
                        : "hover:bg-[#E9DCCB]/60 hover:text-[#A8643A]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <AuthButtons />

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
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-[#D7C7B4] flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium",
                    active
                      ? "bg-[#E9DCCB] font-semibold text-[#A8643A]"
                      : "text-[#2B1D14] hover:bg-[#E9DCCB]/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <AuthButtons mobile />
          </div>
        )}
      </nav>
    </header>
  );
}
