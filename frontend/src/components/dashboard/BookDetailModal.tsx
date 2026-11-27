/**
 * @module components/dashboard/BookDetailModal
 * @description Modal detail lengkap buku menampilkan cover, sinopsis/deskripsi, metadata, dan aksi pinjam langsung.
 */

"use client";

import Image from "next/image";
import { BookOpen, Layers, MapPin, X } from "lucide-react";
import { resolveBookCoverUrl } from "@/lib/api";
import type { CatalogBookItem, UserRole } from "@/types/auth";

interface BookDetailModalProps {
  book: CatalogBookItem;
  role: UserRole;
  busy?: boolean;
  onClose: () => void;
  onBorrow?: (book: CatalogBookItem) => void;
}

export function BookDetailModal({
  book,
  role,
  busy = false,
  onClose,
  onBorrow,
}: BookDetailModalProps) {
  const coverSrc = resolveBookCoverUrl(book.cover_url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku ${book.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-(--border-subtle) pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
              Detail Koleksi · {book.book_code}
            </p>
            <h3 className="font-editorial mt-1 text-xl sm:text-2xl font-bold text-(--text-primary)">
              {book.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail buku"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5">
          <div className="sm:col-span-4 flex justify-center">
            <div className="relative w-44 aspect-[240/340] overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--bg-surface) shadow-md flex items-center justify-center">
              {coverSrc ? (
                <Image
                  src={coverSrc}
                  alt={`Sampul ${book.title}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-(--text-muted) p-4 text-center">
                  <BookOpen size={30} />
                  <span className="text-xs">Belum ada sampul</span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--bg-surface) px-3 py-1 text-xs font-semibold text-(--text-primary)">
                <Layers size={13} className="text-(--accent-primary)" />
                {book.category_name}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--bg-surface) px-3 py-1 text-xs font-medium text-(--text-primary)">
                <MapPin size={13} className="text-(--accent-primary)" />
                {book.shelf_location || "Rak Umum"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tabular-nums ${
                  book.stock_available > 0
                    ? "bg-[#2F6B48]/15 text-[#2F6B48] dark:text-[#9FE0B7]"
                    : "bg-[#9E3B33]/15 text-[#9E3B33] dark:text-[#F5ACA6]"
                }`}
              >
                Tersedia {book.stock_available} dari {book.stock_total}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-(--border-subtle) bg-(--bg-primary) p-3.5 text-xs">
              <div>
                <dt className="text-(--text-muted)">Pengarang</dt>
                <dd className="mt-0.5 font-semibold text-(--text-primary)">{book.author}</dd>
              </div>
              <div>
                <dt className="text-(--text-muted)">Penerbit</dt>
                <dd className="mt-0.5 font-semibold text-(--text-primary)">{book.publisher}</dd>
              </div>
              <div>
                <dt className="text-(--text-muted)">Tahun Terbit</dt>
                <dd className="mt-0.5 font-semibold text-(--text-primary)">{book.publication_year}</dd>
              </div>
              <div>
                <dt className="text-(--text-muted)">Kode Koleksi</dt>
                <dd className="mt-0.5 font-mono font-semibold text-(--accent-primary)">{book.book_code}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                Deskripsi &amp; Sinopsis
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-(--text-primary)">
                {book.description?.trim() ||
                  "Belum ada deskripsi tertulis untuk koleksi buku ini."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-(--border-subtle) pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-(--border-subtle) px-4 text-xs font-semibold text-(--text-primary) cursor-pointer"
          >
            Tutup
          </button>
          {role === "siswa" && onBorrow && (
            <button
              type="button"
              disabled={book.stock_available <= 0 || busy}
              onClick={() => onBorrow(book)}
              className="h-10 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-5 text-xs font-bold text-[#F6EFE6] disabled:opacity-45 cursor-pointer"
            >
              {busy ? "Memproses..." : book.stock_available > 0 ? "Pinjam Buku Ini" : "Stok Habis"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
