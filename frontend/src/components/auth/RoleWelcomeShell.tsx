"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutApi, meApi } from "@/lib/api";
import { getDashboardPath, type AuthUser, type UserRole } from "@/types/auth";

interface RoleWelcomeShellProps {
  expectedRole: UserRole;
  title: string;
  menus: string[];
}

export function RoleWelcomeShell({
  expectedRole,
  title,
  menus,
}: RoleWelcomeShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    meApi()
      .then((res) => {
        if (!active) return;
        const current = res.data?.user;
        if (!current) {
          router.replace("/login");
          return;
        }
        if (current.role !== expectedRole) {
          router.replace(getDashboardPath(current.role));
          return;
        }
        setUser(current);
      })
      .catch(() => {
        if (active) router.replace("/login");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [expectedRole, router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      router.replace("/login");
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
          <Loader2 size={18} className="animate-spin text-[var(--accent-primary)]" />
          Memuat sesi portal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-6 py-4 shadow-xs">
          <Link href="/" className="flex items-center overflow-hidden h-10 rounded-full dark:bg-[#FBF7F1] dark:px-3">
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Denvora Lexora"
              width={240}
              height={160}
              className="h-[68px] w-auto object-contain mix-blend-multiply"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              <ShieldCheck size={14} /> {user.role}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={loggingOut}>
              <LogOut size={15} />
              {loggingOut ? "Keluar..." : "Keluar"}
            </Button>
          </div>
        </header>

        <main className="mt-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            <UserCheck size={14} /> Sesi Aktif Terautentikasi
          </div>
          <h1 className="font-editorial mt-2 text-3xl font-bold text-[var(--text-primary)]">
            {title} — Halo, {user.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Username: <strong>{user.username}</strong>
            {user.email ? ` · Email: ${user.email}` : ""}
            {user.member_code ? ` · NIS: ${user.member_code}` : ""}
            {user.class_name ? ` · ${user.class_name}` : ""}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <div
                key={menu}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-primary)] mb-3">
                  <BookOpen size={17} />
                </div>
                <h2 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                  {menu}
                </h2>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Modul menu utama siap dilanjutkan pada tahap dashboard berikutnya.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
