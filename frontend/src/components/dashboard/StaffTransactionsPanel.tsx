/**
 * @module components/dashboard/StaffTransactionsPanel
 * @description Panel manajemen transaksi peminjaman/pengembalian lengkap untuk Admin dan Petugas beserta ekspor CSV.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2, Plus, Search } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import {
  deleteStaffTransactionApi,
  downloadTransactionsCsvApi,
  fetchAllTransactionsApi,
  updateStaffTransactionApi,
} from "@/lib/portalApi";
import { PaginationBar } from "@/components/dashboard/PaginationBar";
import { StaffTransactionModal } from "@/components/dashboard/StaffTransactionModal";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import type { PaginationMeta } from "@/types/auth";
import type { StaffRolePrefix, TransactionItem } from "@/types/library";

interface StaffTransactionsPanelProps {
  prefix: StaffRolePrefix;
  onChanged?: () => void;
}

export function StaffTransactionsPanel({
  prefix,
  onChanged,
}: StaffTransactionsPanelProps) {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "borrowed" | "returned">("all");
  const [overdueOnly, setOverdueOnly] = useState<"false" | "true">("false");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetchAllTransactionsApi(prefix, {
        search: search.trim(),
        status,
        overdue_only: overdueOnly,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page,
        limit: 8,
      });
      setItems(res.items);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal memuat data transaksi.");
    } finally {
      setLoading(false);
    }
  }, [prefix, search, status, overdueOnly, dateFrom, dateTo, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTransactions();
    }, 180);
    return () => clearTimeout(timer);
  }, [loadTransactions]);

  async function handleMarkReturned(trx: TransactionItem) {
    setBusyId(trx.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await updateStaffTransactionApi(prefix, trx.id, { status: "returned" });
      setNotice(`${res.message} — ${trx.transaction_code}`);
      await loadTransactions();
      onChanged?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal memproses pengembalian.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(trx: TransactionItem) {
    if (!window.confirm(`Hapus catatan transaksi ${trx.transaction_code}?`)) return;
    setBusyId(trx.id);
    setErrorMsg("");
    setNotice("");
    try {
      const res = await deleteStaffTransactionApi(prefix, trx.id);
      setNotice(res.message);
      await loadTransactions();
      onChanged?.();
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal menghapus transaksi.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleExport() {
    setErrorMsg("");
    try {
      await downloadTransactionsCsvApi(prefix, {
        search: search.trim(),
        status,
        overdue_only: overdueOnly,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
    } catch (err) {
      setErrorMsg(err instanceof ApiRequestError ? err.message : "Gagal mengekspor CSV.");
    }
  }

  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
            Manajemen Transaksi Sirkulasi
          </h2>
          <p className="text-xs text-(--text-muted)">
            {meta.total} catatan peminjaman &amp; pengembalian buku tersaring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="h-9.5 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-xs font-semibold text-(--text-primary) hover:text-(--accent-primary) inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Ekspor CSV
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-4 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} /> Catat Peminjaman
          </button>
        </div>
      </div>

      {/* Filter Kondisi Tertentu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-4 relative">
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
            placeholder="Kode TRX, nama siswa, NIS, atau buku..."
            className="h-10 w-full rounded-full border border-(--border-subtle) bg-(--bg-primary) pl-9 pr-4 text-xs sm:text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter status transaksi"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | "borrowed" | "returned");
            setPage(1);
          }}
          className="lg:col-span-2 h-10 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-xs sm:text-sm text-(--text-primary) focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="borrowed">Dipinjam</option>
          <option value="returned">Dikembalikan</option>
        </select>

        <select
          aria-label="Filter keterlambatan"
          value={overdueOnly}
          onChange={(e) => {
            setOverdueOnly(e.target.value as "false" | "true");
            setPage(1);
          }}
          className="lg:col-span-2 h-10 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3.5 text-xs sm:text-sm text-(--text-primary) focus:outline-none"
        >
          <option value="false">Semua Tenggat</option>
          <option value="true">Hanya Terlambat</option>
        </select>

        <input
          type="date"
          aria-label="Tanggal pinjam dari"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-2 h-10 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3 text-xs text-(--text-primary)"
        />
        <input
          type="date"
          aria-label="Tanggal pinjam sampai"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-2 h-10 rounded-full border border-(--border-subtle) bg-(--bg-primary) px-3 text-xs text-(--text-primary)"
        />
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
          Memuat daftar transaksi...
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-(--text-muted)">
          Tidak ada data transaksi pada filter yang dipilih.
        </p>
      ) : (
        <TransactionTable
          items={items}
          busyId={busyId}
          onMarkReturned={handleMarkReturned}
          onDelete={handleDelete}
        />
      )}

      <PaginationBar page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />

      {modalOpen && (
        <StaffTransactionModal
          prefix={prefix}
          onClose={() => setModalOpen(false)}
          onCreated={(msg) => {
            setModalOpen(false);
            setNotice(msg);
            void loadTransactions();
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
