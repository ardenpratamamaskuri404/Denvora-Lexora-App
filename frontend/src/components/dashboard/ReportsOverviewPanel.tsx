/**
 * @module components/dashboard/ReportsOverviewPanel
 * @description Panel dashboard utama Admin/Petugas dengan 4 kartu KPI, grafik tren & kategori, dan ekspor CSV.
 */

"use client";

import { useState } from "react";
import { AlertTriangle, BookCopy, BookOpen, Download, Users } from "lucide-react";
import { downloadTransactionsCsvApi } from "@/lib/portalApi";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LibrarySummary, StaffRolePrefix } from "@/types/library";

interface ReportsOverviewPanelProps {
  prefix: StaffRolePrefix;
  summary: LibrarySummary | null;
  onNavigateTab?: (tabId: string) => void;
}

export function ReportsOverviewPanel({
  prefix,
  summary,
  onNavigateTab,
}: ReportsOverviewPanelProps) {
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
          label="Total Judul Koleksi"
          value={summary.total_titles}
          sublabel={`${summary.available_copies} tersedia dari ${summary.total_copies} eksemplar`}
          icon={BookCopy}
          tone="accent"
          actionLabel="Kelola Buku"
          onAction={onNavigateTab ? () => onNavigateTab("books") : undefined}
        />
        <StatCard
          label="Anggota Siswa Aktif"
          value={summary.total_members}
          sublabel={`${summary.total_staff} petugas layanan aktif`}
          icon={Users}
          tone="success"
          actionLabel={prefix === "/admin" ? "Kelola Anggota" : "Daftar Anggota"}
          onAction={onNavigateTab ? () => onNavigateTab("members") : undefined}
        />
        <StatCard
          label="Peminjaman Aktif"
          value={summary.active_borrows}
          sublabel="Transaksi sirkulasi berjalan"
          icon={BookOpen}
          tone="warning"
          actionLabel="Transaksi Sirkulasi"
          onAction={onNavigateTab ? () => onNavigateTab("transactions") : undefined}
        />
        <StatCard
          label="Melewati Jatuh Tempo"
          value={summary.overdue_borrows}
          sublabel={
            summary.overdue_borrows > 0
              ? "Perlu konfirmasi pengembalian"
              : "Semua peminjaman tepat waktu"
          }
          icon={AlertTriangle}
          tone="danger"
          actionLabel="Cek Keterlambatan"
          onAction={onNavigateTab ? () => onNavigateTab("transactions") : undefined}
        />
      </section>

      <DashboardCharts
        trendPoints={summary.recent_borrows_7d || []}
        categories={summary.categories_breakdown}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Rekapitulasi Koleksi per Kategori</CardTitle>
            <CardDescription>
              Distribusi judul, total eksemplar, dan stok siap pinjam pada tiap rak kategori.
            </CardDescription>
          </div>

          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="h-9.5 rounded-full bg-(--accent-primary) hover:bg-(--accent-hover) px-4 text-xs font-bold text-[#F6EFE6] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shrink-0"
          >
            <Download size={14} />
            {exporting ? "Mengekspor..." : "Ekspor Transaksi (CSV)"}
          </button>
        </CardHeader>

        <CardContent>
          {exportError && (
            <p className="mb-3 text-xs text-[#9E3B33] dark:text-[#F39B8F]">{exportError}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
