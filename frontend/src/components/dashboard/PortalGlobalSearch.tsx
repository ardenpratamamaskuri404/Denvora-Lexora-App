/**
 * @module components/dashboard/PortalGlobalSearch
 * @description Searchbar real-time di topbar portal semua peran untuk mencari koleksi buku secara instan.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Loader2, Search, X } from "lucide-react";
import { resolveBookCoverUrl } from "@/lib/api";
import { fetchBooksApi } from "@/lib/portalApi";
import type { CatalogBookItem, UserRole } from "@/types/auth";

interface PortalGlobalSearchProps {
  role: UserRole;
  onSelectQuery: (keyword: string) => void;
}

export function PortalGlobalSearch({ role, onSelectQuery }: PortalGlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogBookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    const clean = query.trim();
    if (!clean) return;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchBooksApi(`/${role}`, { search: clean, page: 1, limit: 5 });
        setResults(res.items);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query, role]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    setOpen(false);
    onSelectQuery(clean);
  }

  return (
    <div ref={boxRef} className="relative flex-1 max-w-md hidden md:block">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />
        <input
          type="text"
          value={query}
          onFocus={() => {
            if (query.trim() && results.length > 0) setOpen(true);
          }}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (!val.trim()) {
              setResults([]);
              setOpen(false);
            }
          }}
          placeholder="Cari buku, kode, penulis, atau rak secara real-time..."
          className="h-9.5 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) pl-9.5 pr-9 text-xs sm:text-[13px] text-(--text-primary) placeholder:text-(--text-muted)/75 focus:border-(--accent-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
        />
        {loading ? (
          <Loader2
            size={14}
            className="animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 text-(--accent-primary)"
          />
        ) : (
          query && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
            >
              <X size={14} />
            </button>
          )
        )}
      </form>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) shadow-2xl z-50 overflow-hidden"
          >
            {results.length === 0 ? (
              <p className="px-4 py-5 text-center text-xs text-(--text-muted)">
                Tidak ada buku cocok untuk &ldquo;{query.trim()}&rdquo;.
              </p>
            ) : (
              <div className="p-1.5 divide-y divide-(--border-subtle)/50 max-h-72 overflow-y-auto">
                {results.map((book) => {
                  const coverSrc = resolveBookCoverUrl(book.cover_url);
                  return (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onSelectQuery(book.book_code);
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-(--bg-primary) transition-colors cursor-pointer"
                    >
                      <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-md border border-(--border-subtle) bg-(--bg-surface) flex items-center justify-center">
                        {coverSrc ? (
                          <Image src={coverSrc} alt={book.title} fill unoptimized className="object-cover" />
                        ) : (
                          <BookOpen size={13} className="text-(--text-muted)" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-(--text-primary) truncate">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-(--text-muted) truncate">
                          {book.book_code} · {book.author} · {book.shelf_location || "Rak Umum"}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                          book.stock_available > 0
                            ? "bg-[#2F6B48]/15 text-[#2F6B48] dark:text-[#9FE0B7]"
                            : "bg-[#9E3B33]/15 text-[#9E3B33] dark:text-[#F5ACA6]"
                        }`}
                      >
                        {book.stock_available > 0 ? `Stok ${book.stock_available}` : "Habis"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
