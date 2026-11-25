"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/fitur" },
  { label: "Panduan", href: "/alur" },
  { label: "Tentang Kami", href: "/tentang" },
];

function toggleColorTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("denvora-theme", isDark ? "dark" : "light");
  } catch {
    // Abaikan jika penyimpanan lokal dibatasi browser.
  }
}

function ThemeToggleButton() {
  return (
    <button
      type="button"
      onClick={toggleColorTheme}
      aria-label="Ubah mode gelap atau terang"
      title="Mode Gelap / Terang"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--accent-primary)] cursor-pointer shrink-0"
    >
      <Moon size={16} strokeWidth={1.75} className="block dark:hidden" />
      <Sun size={16} strokeWidth={1.75} className="hidden dark:block" />
    </button>
  );
}

function AuthButtons({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "flex items-center gap-2 pt-2" : "hidden md:flex items-center gap-2.5 shrink-0"}>
      <ThemeToggleButton />
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
        className="mx-auto max-w-6xl rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/95 px-4 sm:px-5 py-2 shadow-[0_8px_28px_rgba(43,29,20,0.08)] backdrop-blur-sm transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Beranda Denvora Lexora"
            className="flex items-center shrink-0 overflow-hidden h-11 sm:h-12 rounded-full dark:bg-[#FBF7F1] dark:px-3"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Denvora Lexora — Where Knowledge Finds Its Way."
              width={320}
              height={213}
              priority
              className="h-[74px] sm:h-[84px] w-auto object-contain mix-blend-multiply"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-1.5 transition-colors duration-150",
                      active
                        ? "bg-[var(--bg-surface)] font-semibold text-[var(--accent-primary)]"
                        : "hover:bg-[var(--bg-surface)]/65 hover:text-[var(--accent-primary)]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <AuthButtons />

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggleButton />
            <button
              type="button"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            >
              {mobileOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-[var(--border-subtle)] flex flex-col gap-1.5">
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
                      ? "bg-[var(--bg-surface)] font-semibold text-[var(--accent-primary)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/60"
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
