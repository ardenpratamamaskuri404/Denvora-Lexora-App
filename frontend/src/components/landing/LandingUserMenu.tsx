/**
 * @module components/landing/LandingUserMenu
 * @description Tombol profil pengguna pada navbar publik agar pengguna aktif mudah kembali ke dashboard perannya.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { getDashboardPath, type AuthUser } from "@/types/auth";

interface LandingUserMenuProps {
  user: AuthUser;
  mobile?: boolean;
  onNavigate?: () => void;
  onLogout: () => Promise<void>;
}

const ROLE_LABEL: Record<AuthUser["role"], string> = {
  admin: "Administrator",
  petugas: "Petugas Layanan",
  siswa: "Anggota Siswa",
};

export function LandingUserMenu({
  user,
  mobile = false,
  onNavigate,
  onLogout,
}: LandingUserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dashboardPath = getDashboardPath(user.role);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  async function handleLogoutClick() {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
      setOpen(false);
      onNavigate?.();
    }
  }

  if (mobile) {
    return (
      <div className="pt-3 border-t border-(--border-subtle) space-y-2">
        <div className="rounded-2xl bg-(--bg-surface)/70 px-3.5 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-bold text-(--text-primary) truncate">{user.name}</p>
            <p className="text-[11px] text-(--text-muted) truncate">
              {user.email || `@${user.username}`}
            </p>
          </div>
          <span className="rounded-full bg-(--accent-primary)/15 px-2.5 py-0.5 text-[10px] font-semibold text-(--accent-primary) shrink-0">
            {ROLE_LABEL[user.role]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={dashboardPath}
            onClick={onNavigate}
            className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) text-xs font-bold text-[#F6EFE6] inline-flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogoutClick}
            className="h-9.5 rounded-full border border-[#9E3B33]/40 text-xs font-semibold text-[#9E3B33] dark:text-[#F5ACA6] inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <LogOut size={14} /> {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="relative flex items-center gap-2 shrink-0">
      <Link
        href={dashboardPath}
        className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3.5 text-xs font-bold text-[#F6EFE6] shadow-xs transition-colors"
      >
        <LayoutDashboard size={13} />
        <span>Dashboard</span>
      </Link>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--bg-primary) hover:border-(--accent-primary) pl-1.5 pr-2.5 py-1 transition-colors cursor-pointer"
      >
        <span className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-full bg-(--accent-primary) text-[11px] font-bold text-[#F6EFE6]">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="text-xs font-semibold text-(--text-primary) max-w-[116px] truncate">
          {user.name}
        </span>
        <ChevronDown
          size={13}
          className={`text-(--text-muted) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) shadow-2xl z-50 overflow-hidden"
          >
            <div className="border-b border-(--border-subtle) px-4 py-3 bg-(--bg-primary)/60">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-(--text-primary) truncate">{user.name}</p>
                <span className="rounded-full bg-(--accent-primary)/15 px-2 py-0.5 text-[10px] font-semibold text-(--accent-primary) shrink-0">
                  {ROLE_LABEL[user.role]}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-(--text-muted) truncate">
                {user.email || `@${user.username}`}
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              <Link
                href={dashboardPath}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-(--accent-primary) bg-(--accent-primary)/10 hover:bg-(--accent-primary)/18 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard size={14} /> Kembali ke Dashboard
                </span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href={`${dashboardPath}?tab=settings`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-(--text-primary) hover:bg-(--bg-surface)"
              >
                <Settings size={14} className="text-(--accent-primary)" />
                <span>Pengaturan Akun</span>
              </Link>
            </div>

            <div className="border-t border-(--border-subtle) p-1.5">
              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#9E3B33] dark:text-[#F5ACA6] hover:bg-[#9E3B33]/12 cursor-pointer disabled:opacity-60"
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
