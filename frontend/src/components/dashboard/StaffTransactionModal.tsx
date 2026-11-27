/**
 * @module components/dashboard/StaffTransactionModal
 * @description Modal catat peminjaman buku baru oleh Petugas atau Admin.
 */

"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { formatApiError } from "@/lib/api";
import {
  createStaffTransactionApi,
  fetchBooksApi,
  fetchUsersApi,
} from "@/lib/portalApi";
import type { CatalogBookItem } from "@/types/auth";
import type { PortalMemberItem, StaffRolePrefix } from "@/types/library";

interface StaffTransactionModalProps {
  prefix: StaffRolePrefix;
  onClose: () => void;
  onCreated: (message: string) => void;
}

function addDaysLocal(days: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function StaffTransactionModal({
  prefix,
  onClose,
  onCreated,
}: StaffTransactionModalProps) {
  const [members, setMembers] = useState<PortalMemberItem[]>([]);
  const [books, setBooks] = useState<CatalogBookItem[]>([]);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [borrowDate, setBorrowDate] = useState(addDaysLocal(0));
  const [dueDate, setDueDate] = useState(addDaysLocal(7));
  const [notes, setNotes] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetchUsersApi(prefix, "members", { is_active: "1", limit: 100 }),
      fetchBooksApi(prefix, { availability: "available", limit: 100 }),
    ])
      .then(([mRes, bRes]) => {
        setMembers(mRes.items);
        setBooks(bRes.items);
        if (mRes.items[0]) setUserId(String(mRes.items[0].id));
        if (bRes.items[0]) setBookId(String(bRes.items[0].id));
      })
      .catch(() => setErrorMsg("Gagal memuat daftar anggota atau buku tersedia."))
      .finally(() => setLoadingData(false));
  }, [prefix]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!userId || !bookId) {
      setErrorMsg("Anggota peminjam dan buku wajib dipilih.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createStaffTransactionApi(prefix, {
        user_id: Number(userId),
        book_id: Number(bookId),
        borrow_date: borrowDate,
        due_date: dueDate,
        notes: notes.trim() || undefined,
      });
      onCreated(res.message);
    } catch (err) {
      setErrorMsg(formatApiError(err, "Gagal mencatat transaksi peminjaman."));
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
              Sirkulasi Peminjaman
            </p>
            <h3 className="font-editorial text-xl font-bold text-(--text-primary)">
              Catat Peminjaman Buku
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal transaksi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-(--text-muted) cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-[#9E3B33] bg-[#9E3B33]/15 px-3.5 py-2 text-xs text-[#9E3B33] dark:text-[#FAD5D1]">
            {errorMsg}
          </div>
        )}

        {loadingData ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-(--text-muted)">
            <Loader2 size={16} className="animate-spin text-(--accent-primary)" />
            Menyiapkan daftar anggota &amp; buku tersedia...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <label className="block text-xs font-medium text-(--text-primary)">
              Anggota Peminjam (Siswa Aktif)
              <select
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.member_code || m.username}
                    {m.class_name ? ` — ${m.class_name}` : ""})
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-(--text-primary)">
              Buku yang Dipinjam (Tersedia)
              <select
                required
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    [{b.book_code}] {b.title} (Sisa stok: {b.stock_available})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-(--text-primary)">
                Tanggal Pinjam
                <input
                  type="date"
                  required
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-(--text-primary)">
                Jatuh Tempo
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                />
              </label>
            </div>

            <label className="block text-xs font-medium text-(--text-primary)">
              Catatan (Opsional)
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mis. kondisi sampul baik"
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-(--border-subtle)">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-full border border-(--border-subtle) px-4 text-xs font-semibold text-(--text-primary) cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-10 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-5 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Simpan Transaksi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
