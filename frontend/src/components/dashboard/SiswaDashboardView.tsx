/**
 * @module components/dashboard/SiswaDashboardView
 * @description Portal lengkap Siswa untuk pencarian katalog, peminjaman buku, dan pengembalian mandiri.
 */

"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { meApi } from "@/lib/api";
import { fetchBooksApi, fetchMyTransactionsApi } from "@/lib/portalApi";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/PortalShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { CatalogBooksPanel } from "@/components/dashboard/CatalogBooksPanel";
import { SiswaLoansPanel } from "@/components/dashboard/SiswaLoansPanel";
import { getDashboardPath, type AuthUser } from "@/types/auth";

const SISWA_NAV: PortalNavItem[] = [
  { id: "catalog", label: "Katalog & Pinjam Buku", icon: BookOpen },
  { id: "loans", label: "Peminjaman & Pengembalian", icon: ClipboardList },
];

function SiswaDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("catalog");
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [stats, setStats] = useState({
    activeCount: 0,
    overdueCount: 0,
    returnedCount: 0,
    availableBooks: 0,
  });

  const refreshMetrics = useCallback(async () => {
    try {
      const [trxList, booksRes] = await Promise.all([
        fetchMyTransactionsApi("all"),
        fetchBooksApi("/siswa", { availability: "available", page: 1, limit: 1 }),
      ]);
      const active = trxList.filter((t) => t.status === "borrowed");
      const overdue = active.filter((t) => t.is_overdue);
      const returned = trxList.filter((t) => t.status === "returned");
      setStats({
        activeCount: active.length,
        overdueCount: overdue.length,
        returnedCount: returned.length,
        availableBooks: booksRes.meta?.total ?? booksRes.items.length,
      });
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

  function handleTransactionMutation() {
    setRefreshSignal((s) => s + 1);
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
      navItems={SISWA_NAV}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Sedang Dipinjam"
          value={stats.activeCount}
          sublabel="Maksimal batas waktu 7 hari"
          icon={BookOpen}
          tone="accent"
        />
        <StatCard
          label="Melewati Jatuh Tempo"
          value={stats.overdueCount}
          sublabel={stats.overdueCount > 0 ? "Segera kembalikan buku" : "Semua tepat waktu"}
          icon={AlertTriangle}
          tone={stats.overdueCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Selesai Dikembalikan"
          value={stats.returnedCount}
          sublabel="Total bacaan yang diselesaikan"
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Judul Siap Pinjam"
          value={stats.availableBooks}
          sublabel="Koleksi tersedia di rak saat ini"
          icon={ClipboardList}
        />
      </section>

      {activeTab === "catalog" ? (
        <CatalogBooksPanel
          role="siswa"
          initialSearch={initialSearch}
          onCatalogChanged={handleTransactionMutation}
        />
      ) : (
        <SiswaLoansPanel
          refreshSignal={refreshSignal}
          onReturned={handleTransactionMutation}
        />
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
