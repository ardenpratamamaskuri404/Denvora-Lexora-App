/**
 * @module components/dashboard/PortalShell
 * @description Kerangka dashboard terautentikasi berbasis sidebar Cream Mocha yang responsif dengan sinkronisasi Light/Dark.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Menu, Moon, Sun, X, type LucideIcon } from "lucide-react";
import { logoutApi } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

export interface PortalNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface PortalShellProps {
  user: AuthUser;
  portalLabel: string;
  navItems: PortalNavItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  children: React.ReactNode;
}

function togglePortalTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("denvora-theme", isDark ? "dark" : "light");
  } catch {
    // Abaikan bila localStorage dibatasi browser.
  }
}

export function PortalShell({
  user,
  portalLabel,
  navItems,
  activeTab,
  onSelectTab,
  children,
}: PortalShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      router.replace("/login");
    }
  }

  function renderNavList(closeMobile = false) {
    return (
      <nav className="space-y-1.5" aria-label="Menu portal perpustakaan">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (closeMobile) setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "bg-(--accent-primary) text-[#F6EFE6] shadow-xs"
                  : "text-[#E9DCCB]/85 hover:bg-[#3A281C] hover:text-[#F6EFE6]"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-col lg:flex-row transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:justify-between lg:shrink-0 bg-[#2B1D14] dark:bg-[#140D09] text-[#F6EFE6] border-r border-[#4A3528] p-5">
        <div>
          <Link
            href="/"
            className="flex items-center overflow-hidden h-10 rounded-full bg-[#FBF7F1] px-3 w-fit"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Denvora Lexora"
              width={240}
              height={160}
              className="h-[64px] w-auto object-contain"
            />
          </Link>

          <div className="mt-5 mb-4 px-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C87E4F]">
              {portalLabel}
            </p>
            <p className="mt-1 text-sm font-bold text-[#F6EFE6] truncate">{user.name}</p>
            <p className="text-xs text-[#C2B09E] truncate">
              @{user.username}
              {user.member_code ? ` · NIS ${user.member_code}` : ""}
              {user.class_name ? ` · ${user.class_name}` : ""}
            </p>
          </div>

          {renderNavList(false)}
        </div>

        <div className="space-y-2 border-t border-[#4A3528] pt-4">
          <Link
            href="/"
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-[#E9DCCB] hover:bg-[#3A281C]"
          >
            <ArrowLeft size={15} />
            <span>Beranda</span>
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#FAD5D1] hover:bg-[#9E3B33]/30 cursor-pointer disabled:opacity-60"
          >
            <LogOut size={15} />
            <span>{loggingOut ? "Keluar..." : "Keluar Akun"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-(--border-subtle) bg-(--surface-elevated)/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Buka menu navigasi"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) cursor-pointer"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--accent-primary)">
                  {portalLabel}
                </p>
                <h1 className="font-editorial text-lg sm:text-xl font-bold text-(--text-primary) truncate">
                  {navItems.find((item) => item.id === activeTab)?.label || portalLabel}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={togglePortalTheme}
                aria-label="Ubah mode gelap atau terang"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) hover:text-(--accent-primary) cursor-pointer"
              >
                <Moon size={16} className="block dark:hidden" />
                <Sun size={16} className="hidden dark:block" />
              </button>
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 py-1.5 text-xs font-semibold text-(--text-primary) hover:text-(--accent-primary)"
              >
                <ArrowLeft size={14} /> Beranda
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="lg:hidden inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3.5 py-1.5 text-xs font-semibold text-[#F6EFE6] cursor-pointer"
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 rounded-2xl bg-[#2B1D14] dark:bg-[#140D09] p-3 text-[#F6EFE6]">
              {renderNavList(true)}
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}
