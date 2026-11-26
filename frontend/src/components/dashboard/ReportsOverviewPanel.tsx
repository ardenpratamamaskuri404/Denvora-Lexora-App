/**
 * @module components/dashboard/ReportsOverviewPanel
 * @description Panel ringkasan statistik koleksi, sirkulasi pinjaman, dan ekspor CSV laporan perpustakaan.
 */

"use client";

import { useState } from "react";
import { AlertTriangle, BookCopy, BookOpen, Download, Users } from "lucide-react";
import { downloadTransactionsCsvApi } from "@/lib/portalApi";
import { StatCard } from "@/components/dashboard/StatCard";
import type { LibrarySummary, StaffRolePrefix } from "@/types/library";

interface ReportsOverviewPanelProps {
  prefix: StaffRolePrefix;
  summary: LibrarySummary | null;
}

export function ReportsOverviewPanel({ prefix, summary }: ReportsOverviewPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function handleExport() {
    setExporting(true);
    setExportError("");
    try {
      await downloadTransactionsCsvApi(prefix, { status: "all", overdue_only: "false" });
    } catch {
      setExportError("Gagal mengunduh file laporan CSV.");
    } finally {
      setExporting(false);
    }
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Judul & Eksemplar"
          value={summary.total_titles}
          sublabel={`${summary.available_copies} tersedia dari ${summary.total_copies} eksemplar`}
          icon={BookCopy}
          tone="accent"
        />
        <StatCard
          label="Sedang Dipinjam"
          value={summary.active_borrows}
          sublabel="Transaksi sirkulasi aktif"
          icon={BookOpen}
        />
        <StatCard
          label="Peminjaman Terlambat"
          value={summary.overdue_borrows}
          sublabel={
            summary.overdue_borrows > 0
              ? "Perlu konfirmasi pengembalian"
              : "Tidak ada keterlambatan"
          }
          icon={AlertTriangle}
          tone={summary.overdue_borrows > 0 ? "danger" : "success"}
        />
        <StatCard
          label="Anggota Aktif"
          value={summary.total_members}
          sublabel={`${summary.total_staff} petugas layanan aktif`}
          icon={Users}
        />
      </section>

      <section className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-lg font-bold text-(--text-primary)">
              Rekapitulasi Koleksi per Kategori
            </h2>
            <p className="text-xs text-(--text-muted)">
              Distribusi judul, total eksemplar, dan stok siap pinjam pada tiap rak kategori.
            </p>
          </div>

          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-4 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            <Download size={14} />
            {exporting ? "Mengekspor..." : "Ekspor Transaksi (CSV)"}
          </button>
        </div>

        {exportError && (
          <p className="text-xs text-[#9E3B33] dark:text-[#F39B8F]">{exportError}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--border-subtle) text-[11px] uppercase tracking-wider text-(--text-muted)">
                <th className="py-2.5 pr-3">Nama Kategori</th>
                <th className="py-2.5 pr-3 text-right">Jumlah Judul</th>
                <th className="py-2.5 pr-3 text-right">Total Eksemplar</th>
                <th className="py-2.5 text-right">Tersedia di Rak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)/60">
              {summary.categories_breakdown.map((cat) => (
                <tr key={cat.category_name} className="hover:bg-(--bg-primary)/50">
                  <td className="py-2.5 pr-3 font-medium text-(--text-primary)">
                    {cat.category_name}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-(--text-primary)">
                    {cat.titles_count}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-(--text-muted)">
                    {cat.copies_total}
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-(--accent-primary)">
                    {cat.copies_available}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
