/**
 * @module components/dashboard/SiswaLoansPanel
 * @description Panel riwayat peminjaman aktif dan pengembalian buku khusus Siswa.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import { fetchMyTransactionsApi, returnBySiswaApi } from "@/lib/portalApi";
import type { TransactionItem } from "@/types/library";

interface SiswaLoansPanelProps {
  refreshSignal?: number;
  onReturned?: () => void;
}

export function SiswaLoansPanel({ refreshSignal = 0, onReturned }: SiswaLoansPanelProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "borrowed" | "returned">("all");
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadLoans = useCallback(async () => {
    setErrorMsg("");
    try {
      const data = await fetchMyTransactionsApi(statusFilter);
      setItems(data);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal memuat riwayat pinjam.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadLoans();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLoans, refreshSignal]);

  async function handleReturn(trx: TransactionItem) {
    setReturningId(trx.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await returnBySiswaApi(trx.id);
      setNotice(`${res.message} — "${trx.book_title}".`);
      await loadLoans();
      onReturned?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal mengembalikan buku.");
    } finally {
      setReturningId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
            Riwayat Peminjaman &amp; Pengembalian Buku
          </h2>
          <p className="text-xs text-(--text-muted)">
            Pantau tenggat waktu 7 hari dan kembalikan buku yang selesai dibaca.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-(--border-subtle) bg-(--bg-primary) p-1 text-xs">
          {(
            [
              { id: "all", label: "Semua" },
              { id: "borrowed", label: "Sedang Dipinjam" },
              { id: "returned", label: "Dikembalikan" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-(--accent-primary) text-[#F6EFE6]"
                  : "text-(--text-muted) hover:text-(--text-primary)"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
          Memuat riwayat peminjaman...
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-(--text-muted)">
          Belum ada catatan peminjaman pada filter ini.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--border-subtle) text-[11px] uppercase tracking-wider text-(--text-muted)">
                <th className="py-3 pr-3">Kode Transaksi</th>
                <th className="py-3 pr-3">Judul Buku</th>
                <th className="py-3 pr-3">Tanggal Pinjam</th>
                <th className="py-3 pr-3">Jatuh Tempo</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)/60">
              {items.map((trx) => (
                <tr key={trx.id} className="hover:bg-(--bg-primary)/50">
                  <td className="py-3 pr-3 font-mono text-xs text-(--accent-primary)">
                    {trx.transaction_code}
                  </td>
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-(--text-primary)">{trx.book_title}</p>
                    <p className="text-xs text-(--text-muted)">{trx.book_code}</p>
                  </td>
                  <td className="py-3 pr-3 text-xs text-(--text-primary) tabular-nums">
                    {trx.borrow_date}
                  </td>
                  <td className="py-3 pr-3 text-xs text-(--text-primary) tabular-nums">
                    {trx.due_date}
                    {trx.return_date && (
                      <span className="block text-[11px] text-(--text-muted)">
                        Kembali: {trx.return_date}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    {trx.status === "returned" ? (
                      <span className="inline-block rounded-full bg-[#2F6B48]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6B48] dark:text-[#9FE0B7]">
                        Dikembalikan
                      </span>
                    ) : trx.is_overdue ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#9E3B33]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9E3B33] dark:text-[#F5ACA6]">
                        <AlertTriangle size={12} /> Terlambat {trx.overdue_days} hari
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-[#9A631A]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9A631A] dark:text-[#E5B87A]">
                        Dipinjam
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {trx.status === "borrowed" ? (
                      <button
                        type="button"
                        disabled={returningId === trx.id}
                        onClick={() => handleReturn(trx)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3.5 text-xs font-semibold text-[#F6EFE6] disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        {returningId === trx.id ? "Memproses..." : "Kembalikan"}
                      </button>
                    ) : (
                      <span className="text-xs text-(--text-muted)">Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
