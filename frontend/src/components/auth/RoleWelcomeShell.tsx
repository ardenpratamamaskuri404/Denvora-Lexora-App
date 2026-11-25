/**
 * @module components/auth/RoleWelcomeShell
 * @description Portal terautentikasi awal per peran dengan sinkronisasi hasil pencarian katalog live.
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Loader2, LogOut, Search, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutApi, meApi, searchPublicBooksApi } from "@/lib/api";
import {
  getDashboardPath,
  type AuthUser,
  type CatalogBookItem,
  type UserRole,
} from "@/types/auth";

interface RoleWelcomeShellProps {
  expectedRole: UserRole;
  title: string;
  menus: string[];
}

function RoleWelcomeInner({ expectedRole, title, menus }: RoleWelcomeShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [books, setBooks] = useState<CatalogBookItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
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

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      try {
        const res = await searchPublicBooksApi(searchTerm, 12);
        setBooks(res.data || []);
      } catch {
        setBooks([]);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [user, searchTerm]);

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
      <div className="mx-auto max-w-[1440px]">
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

        <main className="mt-8 space-y-6">
          <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-7 sm:p-8 shadow-xs">
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

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-7 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                  Pencarian Katalog Langsung
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Menampilkan koleksi buku real-time dari basis data perpustakaan.
                </p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari judul, pengarang, kode..."
                  className="h-10 w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] pl-10 pr-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                />
              </div>
            </div>

            {books.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                Tidak ada buku yang sesuai dengan kata kunci tersebut.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-[var(--accent-primary)]">
                        {book.book_code} · {book.category_name}
                      </span>
                      <h3 className="font-editorial mt-1 text-base font-bold text-[var(--text-primary)]">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">{book.author}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                      <span className="text-[var(--text-muted)]">
                        {book.shelf_location || "Rak Utama"}
                      </span>
                      <span
                        className={`font-semibold tabular-nums ${
                          book.stock_available > 0 ? "text-[#2F6B48]" : "text-[#9E3B33]"
                        }`}
                      >
                        {book.stock_available > 0
                          ? `Tersedia (${book.stock_available})`
                          : "Stok Habis"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export function RoleWelcomeShell(props: RoleWelcomeShellProps) {
  return (
    <Suspense fallback={null}>
      <RoleWelcomeInner {...props} />
    </Suspense>
  );
}
