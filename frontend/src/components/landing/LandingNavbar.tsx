/**
 * @module components/landing/LandingNavbar
 * @description Navbar utama mengambang responsif dengan menu per halaman, toggle tema, dan akses Auth.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSplashReveal } from "@/lib/useSplashReveal";
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--surface-elevated) text-(--text-primary) transition-colors hover:bg-(--bg-surface) hover:text-(--accent-primary) cursor-pointer shrink-0"
    >
      <Moon size={16} strokeWidth={1.75} className="block dark:hidden" />
      <Sun size={16} strokeWidth={1.75} className="hidden dark:block" />
    </button>
  );
}

function AuthButtons({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={
        mobile
          ? "grid grid-cols-2 gap-2.5 pt-3 border-t border-(--border-subtle)"
          : "hidden md:flex items-center gap-2.5 shrink-0"
      }
    >
      {!mobile && <ThemeToggleButton />}
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn("rounded-full", mobile ? "w-full justify-center" : "px-4")}
      >
        <Link href="/login" onClick={onNavigate}>
          Masuk
        </Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={cn("rounded-full", mobile ? "w-full justify-center" : "px-5")}
      >
        <Link href="/register" onClick={onNavigate}>
          Daftar Anggota
        </Link>
      </Button>
    </div>
  );
}

export function LandingNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const revealed = useSplashReveal();

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-4">
      <motion.nav
        aria-label="Navigasi utama"
        initial={false}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
        transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mx-auto max-w-4xl border border-(--border-subtle) bg-(--surface-elevated)/95 shadow-[0_8px_28px_rgba(43,29,20,0.08)] backdrop-blur-md transition-colors",
          mobileOpen
            ? "rounded-3xl px-4 py-3.5 md:rounded-full md:px-4 md:py-1.5"
            : "rounded-full px-3.5 sm:px-4 py-1.5"
        )}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Link
            href="/"
            aria-label="Beranda Denvora Lexora"
            onClick={() => setMobileOpen(false)}
            className="flex items-center shrink-0 overflow-hidden h-10 sm:h-11 rounded-full dark:bg-[#FBF7F1] dark:px-3"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Denvora Lexora — Where Knowledge Finds Its Way."
              width={320}
              height={213}
              priority
              className="h-[64px] sm:h-[76px] w-auto object-contain mix-blend-multiply"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-(--text-primary)">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 lg:px-3.5 py-1.5 transition-colors duration-150",
                      active
                        ? "bg-(--bg-surface) font-semibold text-(--accent-primary)"
                        : "hover:bg-(--bg-surface)/65 hover:text-(--accent-primary)"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <AuthButtons />

          <div className="md:hidden flex items-center gap-2 shrink-0">
            <ThemeToggleButton />
            <button
              type="button"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--surface-elevated) text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
            >
              {mobileOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-(--border-subtle) flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-(--bg-surface) font-semibold text-(--accent-primary)"
                      : "text-(--text-primary) hover:bg-(--bg-surface)/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <AuthButtons mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </motion.nav>
    </header>
  );
}
