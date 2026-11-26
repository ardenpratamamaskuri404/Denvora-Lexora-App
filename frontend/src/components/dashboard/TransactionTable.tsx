/**
 * @module components/dashboard/TransactionTable
 * @description Tabel transaksi sirkulasi perpustakaan untuk panel Petugas dan Admin.
 */

import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import type { TransactionItem } from "@/types/library";

interface TransactionTableProps {
  items: TransactionItem[];
  busyId: number | null;
  onMarkReturned: (trx: TransactionItem) => void;
  onDelete: (trx: TransactionItem) => void;
}

export function TransactionTable({
  items,
  busyId,
  onMarkReturned,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-(--border-subtle) text-[11px] uppercase tracking-wider text-(--text-muted)">
            <th className="py-3 pr-3">Kode</th>
            <th className="py-3 pr-3">Peminjam</th>
            <th className="py-3 pr-3">Buku</th>
            <th className="py-3 pr-3">Pinjam / Tempo</th>
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
                <p className="font-semibold text-(--text-primary)">{trx.member_name}</p>
                <p className="text-xs text-(--text-muted)">
                  {trx.member_code || "—"} {trx.class_name ? `· ${trx.class_name}` : ""}
                </p>
              </td>
              <td className="py-3 pr-3">
                <p className="font-medium text-(--text-primary)">{trx.book_title}</p>
                <p className="text-xs text-(--text-muted)">{trx.book_code}</p>
              </td>
              <td className="py-3 pr-3 text-xs tabular-nums text-(--text-primary)">
                {trx.borrow_date}
                <span className="block text-[11px] text-(--text-muted)">
                  Tempo: {trx.due_date}
                </span>
              </td>
              <td className="py-3 pr-3">
                {trx.status === "returned" ? (
                  <span className="inline-block rounded-full bg-[#2F6B48]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6B48] dark:text-[#9FE0B7]">
                    Kembali ({trx.return_date})
                  </span>
                ) : trx.is_overdue ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#9E3B33]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9E3B33] dark:text-[#F5ACA6]">
                    <AlertTriangle size={12} /> Terlambat {trx.overdue_days}h
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-[#9A631A]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#9A631A] dark:text-[#E5B87A]">
                    Dipinjam
                  </span>
                )}
              </td>
              <td className="py-3 text-right">
                <div className="inline-flex items-center gap-1.5">
                  {trx.status === "borrowed" && (
                    <button
                      type="button"
                      disabled={busyId === trx.id}
                      onClick={() => onMarkReturned(trx)}
                      className="inline-flex h-8 items-center gap-1 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-3 text-xs font-semibold text-[#F6EFE6] cursor-pointer"
                    >
                      <RotateCcw size={12} /> Kembalikan
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === trx.id}
                    onClick={() => onDelete(trx)}
                    aria-label={`Hapus ${trx.transaction_code}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-subtle) text-[#9E3B33] hover:bg-[#9E3B33]/15 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
