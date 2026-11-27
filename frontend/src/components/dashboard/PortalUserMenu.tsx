/**
 * @module components/dashboard/PortalUserMenu
 * @description Menu dropdown profil pengguna di topbar kanan yang menampilkan nama, email, dan pintasan akun untuk semua role.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Globe, LayoutDashboard, LogOut, Settings } from "lucide-react";
import type { AuthUser } from "@/types/auth";

interface PortalUserMenuProps {
  user: AuthUser;
  loggingOut: boolean;
  onNavigateTab: (tabId: string) => void;
  onLogout: () => void;
}

const ROLE_BADGE: Record<AuthUser["role"], string> = {
  admin: "Administrator",
  petugas: "Petugas Layanan",
  siswa: "Anggota Siswa",
};

export function PortalUserMenu({
  user,
  loggingOut,
  onNavigateTab,
  onLogout,
}: PortalUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-primary) hover:border-(--accent-primary) pl-1.5 pr-2.5 py-1 transition-colors cursor-pointer"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--accent-primary) text-xs font-bold text-[#F6EFE6]">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="hidden sm:block text-left leading-tight max-w-[140px]">
          <p className="text-xs font-semibold text-(--text-primary) truncate">{user.name}</p>
          <p className="text-[10px] text-(--text-muted) truncate">
            {user.email || `@${user.username}`}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-(--text-muted) transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) shadow-2xl z-50 overflow-hidden"
          >
            <div className="border-b border-(--border-subtle) px-4 py-3 bg-(--bg-primary)/60">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-(--text-primary) truncate">{user.name}</p>
                <span className="rounded-full bg-(--accent-primary)/15 px-2 py-0.5 text-[10px] font-semibold text-(--accent-primary) shrink-0">
                  {ROLE_BADGE[user.role]}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-(--text-muted) truncate">
                {user.email || `@${user.username}`}
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onNavigateTab("overview");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
              >
                <LayoutDashboard size={14} className="text-(--accent-primary)" />
                <span>Dashboard Utama</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onNavigateTab("settings");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
              >
                <Settings size={14} className="text-(--accent-primary)" />
                <span>Pengaturan Akun</span>
              </button>
              <Link
                href="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-(--text-primary) hover:bg-(--bg-surface)"
              >
                <Globe size={14} className="text-(--accent-primary)" />
                <span>Beranda Publik</span>
              </Link>
            </div>

            <div className="border-t border-(--border-subtle) p-1.5">
              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#9E3B33] dark:text-[#F5ACA6] hover:bg-[#9E3B33]/12 cursor-pointer disabled:opacity-60"
              >
                <LogOut size={14} />
                <span>{loggingOut ? "Keluar..." : "Keluar Akun"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
