/**
 * @module components/dashboard/SiswaDashboardView
 * @description Portal real-time Siswa dengan grafik animasi Recharts, notifikasi langsung, detail cover/deskripsi, dan pengaturan akun.
 */

"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  Settings,
} from "lucide-react";
import { fetchNotificationsApi, meApi } from "@/lib/api";
import { fetchBooksApi, fetchCategoriesApi, fetchMyTransactionsApi } from "@/lib/portalApi";
import { broadcastPortalSync, useRealtimeSync } from "@/lib/useRealtimeSync";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/PortalShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { CatalogBooksPanel } from "@/components/dashboard/CatalogBooksPanel";
import { SiswaLoansPanel } from "@/components/dashboard/SiswaLoansPanel";
import { AccountSettingsPanel } from "@/components/dashboard/AccountSettingsPanel";
import { getDashboardPath, type AuthUser, type PortalNotificationItem } from "@/types/auth";
import type { CategoryStatItem, DailyBorrowPoint, TransactionItem } from "@/types/library";

const SISWA_NAV: PortalNavItem[] = [
  { id: "overview", group: "Utama", label: "Dashboard", icon: LayoutDashboard },
  { id: "catalog", group: "Layanan Baca", label: "Katalog Buku", icon: BookOpen },
  { id: "loans", group: "Sirkulasi", label: "Pinjam & Kembali", icon: ArrowLeftRight },
  { id: "settings", group: "Akun", label: "Pengaturan", icon: Settings },
];

function buildStudent7dTrend(loans: TransactionItem[]): DailyBorrowPoint[] {
  const counts = new Map<string, number>();
  loans.forEach((t) => {
    const key = t.borrow_date.slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const points: DailyBorrowPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const dt = new Date();
    dt.setDate(dt.getDate() - offset);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate()
    ).padStart(2, "0")}`;
    points.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return points;
}

function SiswaDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialTabParam = searchParams.get("tab");

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    initialSearch
      ? "catalog"
      : initialTabParam === "settings" || initialTabParam === "loans" || initialTabParam === "catalog"
        ? initialTabParam
        : "overview"
  );
  const [quickSearch, setQuickSearch] = useState(initialSearch);
  const [searchNonce, setSearchNonce] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [trend7d, setTrend7d] = useState<DailyBorrowPoint[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStatItem[]>([]);
  const [notifications, setNotifications] = useState<PortalNotificationItem[]>([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    overdueCount: 0,
    returnedCount: 0,
    availableBooks: 0,
  });

  const refreshMetrics = useCallback(async () => {
    try {
      const [trxList, booksRes, cats, notifRes] = await Promise.all([
        fetchMyTransactionsApi("all"),
        fetchBooksApi("/siswa", { availability: "all", page: 1, limit: 100 }),
        fetchCategoriesApi("/siswa"),
        fetchNotificationsApi().catch(() => null),
      ]);
      const active = trxList.filter((t) => t.status === "borrowed");
      const overdue = active.filter((t) => t.is_overdue);
      const returned = trxList.filter((t) => t.status === "returned");

      setStats({
        activeCount: active.length,
        overdueCount: overdue.length,
        returnedCount: returned.length,
        availableBooks: booksRes.items.filter((b) => b.stock_available > 0).length,
      });
      setTrend7d(buildStudent7dTrend(trxList));
      setCategoryStats(
        cats.map((c) => {
          const matching = booksRes.items.filter((b) => b.category_id === c.id);
          return {
            category_name: c.name,
            titles_count: matching.length,
            copies_total: matching.reduce((s, b) => s + b.stock_total, 0),
            copies_available: matching.reduce((s, b) => s + b.stock_available, 0),
          };
        })
      );
      if (notifRes?.data?.items) {
        setNotifications(notifRes.data.items);
      }
    } catch {
      // Abaikan jika metrik ringkasan belum tersedia sementara.
    }
  }, []);

  useEffect(() => {
    let active = true;
    meApi()
      .then((res) => {
        if (!active) return;
        const current = res.data?.user;
        if (!current) {
          router.replace("/login");
          return;
        }
        if (current.role !== "siswa") {
          router.replace(getDashboardPath(current.role));
          return;
        }
        setUser(current);
        void refreshMetrics();
      })
      .catch(() => {
        if (active) router.replace("/login");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, refreshMetrics]);

  const handleRealtimeTick = useCallback(() => {
    if (!user) return;
    setRefreshSignal((s) => s + 1);
    void refreshMetrics();
  }, [user, refreshMetrics]);

  useRealtimeSync(handleRealtimeTick, 8000);

  function handleTransactionMutation() {
    setRefreshSignal((s) => s + 1);
    broadcastPortalSync("siswa-trx");
    void refreshMetrics();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-(--text-muted)">
          <Loader2 size={18} className="animate-spin text-(--accent-primary)" />
          Memuat Dashboard Siswa...
        </div>
      </div>
    );
  }

  return (
    <PortalShell
      user={user}
      portalLabel="Portal Anggota Siswa"
      portalSubtitle="Layanan Baca & Peminjaman"
      navItems={SISWA_NAV}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onQuickSearch={(kw) => {
        setQuickSearch(kw);
        setSearchNonce((n) => n + 1);
        setActiveTab("catalog");
      }}
      notifications={notifications}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              delay={0}
              label="Judul Siap Pinjam"
              value={stats.availableBooks}
              sublabel="Koleksi tersedia di rak saat ini"
              icon={BookOpen}
              tone="accent"
              actionLabel="Jelajahi Katalog"
              onAction={() => setActiveTab("catalog")}
            />
            <StatCard
              delay={0.05}
              label="Sedang Dipinjam"
              value={stats.activeCount}
              sublabel="Maksimal batas waktu 7 hari"
              icon={ArrowLeftRight}
              tone="warning"
              actionLabel="Lihat Pinjaman"
              onAction={() => setActiveTab("loans")}
            />
            <StatCard
              delay={0.1}
              label="Selesai Dikembalikan"
              value={stats.returnedCount}
              sublabel="Total bacaan yang diselesaikan"
              icon={CheckCircle2}
              tone="success"
              actionLabel="Riwayat Baca"
              onAction={() => setActiveTab("loans")}
            />
            <StatCard
              delay={0.15}
              label="Melewati Jatuh Tempo"
              value={stats.overdueCount}
              sublabel={
                stats.overdueCount > 0 ? "Segera kembalikan buku" : "Semua peminjaman tertib"
              }
              icon={AlertTriangle}
              tone="danger"
              actionLabel="Cek Pengembalian"
              onAction={() => setActiveTab("loans")}
            />
          </section>

          <DashboardCharts
            trendTitle="Aktivitas Peminjaman Saya (7 Hari Terakhir)"
            trendPoints={trend7d}
            categories={categoryStats}
          />
        </div>
      )}

      {activeTab === "catalog" && (
        <CatalogBooksPanel
          key={`siswa-cat-${searchNonce}`}
          role="siswa"
          initialSearch={quickSearch}
          refreshSignal={refreshSignal}
          onCatalogChanged={handleTransactionMutation}
        />
      )}

      {activeTab === "loans" && (
        <SiswaLoansPanel
          refreshSignal={refreshSignal}
          onReturned={handleTransactionMutation}
        />
      )}

      {activeTab === "settings" && (
        <AccountSettingsPanel user={user} onUserUpdated={setUser} />
      )}
    </PortalShell>
  );
}

export function SiswaDashboardView() {
  return (
    <Suspense fallback={null}>
      <SiswaDashboardInner />
    </Suspense>
  );
}
