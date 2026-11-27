/**
 * @module components/dashboard/StaffTransactionEditModal
 * @description Modal ubah status, tanggal jatuh tempo, tanggal kembali, dan catatan transaksi oleh Petugas/Admin.
 */

"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { formatApiError } from "@/lib/api";
import { updateStaffTransactionApi } from "@/lib/portalApi";
import type { StaffRolePrefix, TransactionItem } from "@/types/library";

interface StaffTransactionEditModalProps {
  prefix: StaffRolePrefix;
  transaction: TransactionItem;
  onClose: () => void;
  onUpdated: (message: string) => void;
}

function formatTodayLocal(): string {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function StaffTransactionEditModal({
  prefix,
  transaction,
  onClose,
  onUpdated,
}: StaffTransactionEditModalProps) {
  const [status, setStatus] = useState<"borrowed" | "returned">(transaction.status);
  const [dueDate, setDueDate] = useState(transaction.due_date.slice(0, 10));
  const [returnDate, setReturnDate] = useState(
    transaction.return_date ? transaction.return_date.slice(0, 10) : ""
  );
  const [notes, setNotes] = useState(transaction.notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (dueDate < transaction.borrow_date.slice(0, 10)) {
      setErrorMsg("Tanggal jatuh tempo tidak boleh lebih awal dari tanggal pinjam.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateStaffTransactionApi(prefix, transaction.id, {
        status,
        due_date: dueDate,
        return_date:
          status === "returned" ? returnDate || formatTodayLocal() : null,
        notes: notes.trim() || null,
      });
      onUpdated(`${res.message} — ${transaction.transaction_code}`);
    } catch (err) {
      setErrorMsg(formatApiError(err, "Gagal memperbarui data transaksi."));
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
              Ubah Transaksi · {transaction.transaction_code}
            </p>
            <h3 className="font-editorial text-xl font-bold text-(--text-primary)">
              {transaction.book_title}
            </h3>
            <p className="text-xs text-(--text-muted)">
              Peminjam: {transaction.member_name} · Pinjam: {transaction.borrow_date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal ubah transaksi"
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-(--text-primary)">
              Status Sirkulasi
              <select
                value={status}
                onChange={(e) => {
                  const next = e.target.value as "borrowed" | "returned";
                  setStatus(next);
                  if (next === "returned" && !returnDate) {
                    setReturnDate(formatTodayLocal());
                  }
                }}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              >
                <option value="borrowed">Dipinjam</option>
                <option value="returned">Dikembalikan</option>
              </select>
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

          {status === "returned" && (
            <label className="block text-xs font-medium text-(--text-primary)">
              Tanggal Pengembalian
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) px-3 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
              />
            </label>
          )}

          <label className="block text-xs font-medium text-(--text-primary)">
            Catatan Transaksi
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={255}
              placeholder="Mis. diperpanjang 3 hari atau kondisi buku baik"
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
