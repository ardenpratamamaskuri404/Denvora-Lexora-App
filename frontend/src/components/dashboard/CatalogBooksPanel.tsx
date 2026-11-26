/**
 * @module components/dashboard/CatalogBooksPanel
 * @description Panel katalog buku dengan pencarian kondisi tertentu, paginasi, aksi pinjam Siswa, dan CRUD Admin/Petugas.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { BookPlus, CheckCircle2, Loader2, Search } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import {
  borrowBySiswaApi,
  deleteBookApi,
  fetchBooksApi,
  fetchCategoriesApi,
} from "@/lib/portalApi";
import { BookFormModal } from "@/components/dashboard/BookFormModal";
import { BookCatalogTable } from "@/components/dashboard/BookCatalogTable";
import { CategoryManagerCard } from "@/components/dashboard/CategoryManagerCard";
import { PaginationBar } from "@/components/dashboard/PaginationBar";
import type { CatalogBookItem, PaginationMeta, UserRole } from "@/types/auth";
import type { CategoryItem, PortalRolePrefix, StaffRolePrefix } from "@/types/library";

interface CatalogBooksPanelProps {
  role: UserRole;
  initialSearch?: string;
  onCatalogChanged?: () => void;
}

export function CatalogBooksPanel({
  role,
  initialSearch = "",
  onCatalogChanged,
}: CatalogBooksPanelProps) {
  const prefix: PortalRolePrefix = `/${role}`;
  const isStaffOrAdmin = role === "admin" || role === "petugas";
  const allowDelete = role === "admin";

  const [books, setBooks] = useState<CatalogBookItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<string>("");
  const [availability, setAvailability] = useState<"all" | "available" | "empty">("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [busyBookId, setBusyBookId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<CatalogBookItem | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const list = await fetchCategoriesApi(prefix);
      setCategories(list);
    } catch {
      // Abaikan kegagalan awal agar katalog tetap termuat.
    }
  }, [prefix]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetchBooksApi(prefix, {
        search: search.trim(),
        category_id: categoryId ? Number(categoryId) : undefined,
        availability,
        page,
        limit: 8,
      });
      setBooks(res.items);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal memuat katalog buku.");
    } finally {
      setLoading(false);
    }
  }, [prefix, search, categoryId, availability, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadBooks();
    }, 180);
    return () => clearTimeout(timer);
  }, [loadBooks]);

  async function handleBorrow(book: CatalogBookItem) {
    setBusyBookId(book.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await borrowBySiswaApi(book.id);
      setNotice(`${res.message} — "${book.title}" (batas kembali 7 hari).`);
      await loadBooks();
      onCatalogChanged?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal meminjam buku.");
    } finally {
      setBusyBookId(null);
    }
  }

  async function handleDeleteBook(book: CatalogBookItem) {
    if (!window.confirm(`Hapus buku "${book.title}" dari katalog?`)) return;
    setBusyBookId(book.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await deleteBookApi(book.id);
      setNotice(res.message);
      await loadBooks();
      onCatalogChanged?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal menghapus buku.");
    } finally {
      setBusyBookId(null);
    }
  }

  return (
    <div className="space-y-5">
      {isStaffOrAdmin && (
        <CategoryManagerCard
          prefix={prefix as StaffRolePrefix}
          categories={categories}
          allowDelete={allowDelete}
          onChanged={(msg) => {
            setNotice(msg);
            void loadCategories();
            void loadBooks();
            onCatalogChanged?.();
          }}
        />
      )}

      <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
              Katalog &amp; Pencarian Koleksi Buku
            </h2>
            <p className="text-xs text-(--text-muted)">
              Menampilkan {meta.total} judul buku · filter kategori &amp; ketersediaan stok.
            </p>
          </div>

          {isStaffOrAdmin && (
            <button
              type="button"
              onClick={() => {
                setEditingBook(null);
                setModalOpen(true);
              }}
              className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-4 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookPlus size={15} /> Tambah Buku
            </button>
          )}
        </div>

        {/* Pencarian Kondisi Tertentu */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari kode buku, judul, pengarang, atau rak..."
              className="h-10 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) pl-9 pr-4 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              aria-label="Filter kategori buku"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              aria-label="Filter ketersediaan stok"
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value as "all" | "available" | "empty");
                setPage(1);
              }}
              className="h-10 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
            >
              <option value="all">Semua Status Stok</option>
              <option value="available">Tersedia di Rak</option>
              <option value="empty">Stok Habis</option>
            </select>
          </div>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#2F6B48] bg-[#2F6B48]/15 px-4 py-2.5 text-xs text-[#2F6B48] dark:text-[#9FE0B7]">
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-4 py-2.5 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
            <Loader2 size={16} className="animate-spin text-(--accent-primary)" />
            Memuat katalog buku...
          </div>
        ) : books.length === 0 ? (
          <p className="py-10 text-center text-sm text-(--text-muted)">
            Tidak ada koleksi buku yang cocok dengan kriteria pencarian saat ini.
          </p>
        ) : (
          <BookCatalogTable
            books={books}
            role={role}
            allowDelete={allowDelete}
            busyBookId={busyBookId}
            onBorrow={handleBorrow}
            onEdit={(book) => {
              setEditingBook(book);
              setModalOpen(true);
            }}
            onDelete={handleDeleteBook}
          />
        )}

        <PaginationBar page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      </div>

      {modalOpen && isStaffOrAdmin && (
        <BookFormModal
          prefix={prefix as StaffRolePrefix}
          categories={categories}
          editingBook={editingBook}
          onClose={() => setModalOpen(false)}
          onSaved={(msg) => {
            setModalOpen(false);
            setNotice(msg);
            void loadBooks();
            onCatalogChanged?.();
          }}
        />
      )}
    </div>
  );
}
