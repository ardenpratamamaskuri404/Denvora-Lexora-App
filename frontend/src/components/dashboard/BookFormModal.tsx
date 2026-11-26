/**
 * @module components/dashboard/BookFormModal
 * @description Modal formulir tambah dan ubah data buku beserta validasi input katalog.
 */

"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import { createBookApi, updateBookApi } from "@/lib/portalApi";
import type { CatalogBookItem } from "@/types/auth";
import type { BookPayload, CategoryItem, StaffRolePrefix } from "@/types/library";

interface BookFormModalProps {
  prefix: StaffRolePrefix;
  categories: CategoryItem[];
  editingBook: CatalogBookItem | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function BookFormModal({
  prefix,
  categories,
  editingBook,
  onClose,
  onSaved,
}: BookFormModalProps) {
  const [bookCode, setBookCode] = useState(editingBook?.book_code || "");
  const [title, setTitle] = useState(editingBook?.title || "");
  const [author, setAuthor] = useState(editingBook?.author || "");
  const [publisher, setPublisher] = useState(editingBook?.publisher || "");
  const [year, setYear] = useState(String(editingBook?.publication_year || new Date().getFullYear()));
  const [categoryId, setCategoryId] = useState(
    String(editingBook?.category_id || categories[0]?.id || "")
  );
  const [stockTotal, setStockTotal] = useState(String(editingBook?.stock_total ?? 5));
  const [shelfLocation, setShelfLocation] = useState(editingBook?.shelf_location || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const payload: BookPayload = {
      book_code: bookCode.trim(),
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      publication_year: Number(year),
      category_id: Number(categoryId),
      stock_total: Number(stockTotal),
      shelf_location: shelfLocation.trim() || null,
    };

    if (!payload.book_code || !payload.title || !payload.author || !payload.publisher) {
      setErrorMsg("Kode buku, judul, pengarang, dan penerbit wajib diisi.");
      return;
    }
    if (!payload.category_id) {
      setErrorMsg("Pilih kategori buku terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = editingBook
        ? await updateBookApi(prefix, editingBook.id, payload)
        : await createBookApi(prefix, payload);
      onSaved(res.message);
    } catch (err) {
      setErrorMsg(
        err instanceof ApiRequestError ? err.message : "Gagal menyimpan data buku."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-(--border-subtle) bg-(--surface-elevated) p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
              Manajemen Katalog
            </p>
            <h3 className="font-editorial text-xl font-bold text-(--text-primary)">
              {editingBook ? "Ubah Data Buku" : "Tambah Buku Baru"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal buku"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-3.5 py-2 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Kode Buku
              <input
                required
                value={bookCode}
                onChange={(e) => setBookCode(e.target.value)}
                placeholder="BK-010"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Kategori
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs font-medium text-(--text-primary)">
            Judul Buku
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul lengkap buku"
              className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Pengarang
              <input
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama penulis"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Penerbit
              <input
                required
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Nama penerbit"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Tahun Terbit
              <input
                type="number"
                required
                min={1900}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Stok Total
              <input
                type="number"
                required
                min={0}
                max={10000}
                value={stockTotal}
                onChange={(e) => setStockTotal(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
            <label className="block text-xs font-medium text-(--text-primary)">
              Lokasi Rak
              <input
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Rak A1"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-(--border-subtle)">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full border border-(--border-subtle) px-4 text-xs font-semibold text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-5 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {editingBook ? "Simpan Perubahan" : "Simpan Buku"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
