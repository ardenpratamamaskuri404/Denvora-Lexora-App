/**
 * @module components/dashboard/BookCatalogTable
 * @description Tabel daftar buku katalog dilengkapi thumbnail sampul, detail deskripsi, dan aksi pinjam/kelola.
 */

import Image from "next/image";
import { BookOpen, Eye, Pencil, Trash2 } from "lucide-react";
import { resolveBookCoverUrl } from "@/lib/api";
import type { CatalogBookItem, UserRole } from "@/types/auth";

interface BookCatalogTableProps {
  books: CatalogBookItem[];
  role: UserRole;
  allowDelete: boolean;
  busyBookId: number | null;
  onViewDetail: (book: CatalogBookItem) => void;
  onBorrow: (book: CatalogBookItem) => void;
  onEdit: (book: CatalogBookItem) => void;
  onDelete: (book: CatalogBookItem) => void;
}

export function BookCatalogTable({
  books,
  role,
  allowDelete,
  busyBookId,
  onViewDetail,
  onBorrow,
  onEdit,
  onDelete,
}: BookCatalogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-(--border-subtle) text-[11px] uppercase tracking-wider text-(--text-muted)">
            <th className="py-3 pr-3">Kode</th>
            <th className="py-3 pr-3">Buku &amp; Deskripsi</th>
            <th className="py-3 pr-3">Kategori</th>
            <th className="py-3 pr-3">Rak</th>
            <th className="py-3 pr-3">Stok</th>
            <th className="py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-subtle)/60">
          {books.map((book) => {
            const coverSrc = resolveBookCoverUrl(book.cover_url);
            return (
              <tr key={book.id} className="hover:bg-(--bg-primary)/50">
                <td className="py-3 pr-3 font-mono text-xs text-(--accent-primary) align-top">
                  {book.book_code}
                </td>
                <td className="py-3 pr-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onViewDetail(book)}
                      title="Lihat detail & deskripsi buku"
                      className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-(--border-subtle) bg-(--bg-surface) flex items-center justify-center hover:ring-2 hover:ring-(--accent-primary)/50 cursor-pointer"
                    >
                      {coverSrc ? (
                        <Image src={coverSrc} alt={book.title} fill unoptimized className="object-cover" />
                      ) : (
                        <BookOpen size={15} className="text-(--text-muted)" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onViewDetail(book)}
                        className="text-left font-semibold text-(--text-primary) hover:text-(--accent-primary) cursor-pointer"
                      >
                        {book.title}
                      </button>
                      <p className="text-xs text-(--text-muted)">
                        {book.author} · {book.publisher} ({book.publication_year})
                      </p>
                      {book.description && (
                        <p className="mt-0.5 text-[11px] text-(--text-muted)/85 line-clamp-1 max-w-md">
                          {book.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-3 text-xs text-(--text-primary)">{book.category_name}</td>
                <td className="py-3 pr-3 text-xs text-(--text-muted)">
                  {book.shelf_location || "—"}
                </td>
                <td className="py-3 pr-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                      book.stock_available > 0
                        ? "bg-[#2F6B48]/15 text-[#2F6B48] dark:text-[#9FE0B7]"
                        : "bg-[#9E3B33]/15 text-[#9E3B33] dark:text-[#F5ACA6]"
                    }`}
                  >
                    {book.stock_available} / {book.stock_total}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetail(book)}
                      aria-label={`Detail ${book.title}`}
                      title="Lihat detail & sinopsis"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) cursor-pointer"
                    >
                      <Eye size={13} />
                    </button>

                    {role === "siswa" ? (
                      <button
                        type="button"
                        disabled={book.stock_available <= 0 || busyBookId === book.id}
                        onClick={() => onBorrow(book)}
                        className="h-8 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3.5 text-xs font-semibold text-[#F6EFE6] disabled:opacity-45 cursor-pointer"
                      >
                        {busyBookId === book.id ? "Memproses..." : "Pinjam"}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(book)}
                          aria-label={`Ubah ${book.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
                        {allowDelete && (
                          <button
                            type="button"
                            disabled={busyBookId === book.id}
                            onClick={() => onDelete(book)}
                            aria-label={`Hapus ${book.title}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-[#9E3B33] hover:bg-[#9E3B33]/15 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
