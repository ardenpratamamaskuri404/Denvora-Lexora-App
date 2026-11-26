/**
 * @module components/dashboard/StaffDashboardView
 * @description Portal dashboard terpadu untuk Petugas dan Admin dengan navigasi terkelompok bergaya shadcn/ui.
 */

"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftRight,
  BookOpen,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { meApi } from "@/lib/api";
import { fetchReportSummaryApi } from "@/lib/portalApi";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/PortalShell";
import { ReportsOverviewPanel } from "@/components/dashboard/ReportsOverviewPanel";
import { CatalogBooksPanel } from "@/components/dashboard/CatalogBooksPanel";
import { StaffTransactionsPanel } from "@/components/dashboard/StaffTransactionsPanel";
import { UsersManagementPanel } from "@/components/dashboard/UsersManagementPanel";
import { getDashboardPath, type AuthUser } from "@/types/auth";
import type { LibrarySummary, StaffRolePrefix } from "@/types/library";

interface StaffDashboardViewProps {
  expectedRole: "admin" | "petugas";
}

function getStaffNavItems(role: "admin" | "petugas"): PortalNavItem[] {
  const items: PortalNavItem[] = [
    { id: "overview", group: "Utama", label: "Dashboard Utama", icon: LayoutDashboard },
    { id: "books", group: "Master Data", label: "Koleksi Buku & Kategori", icon: BookOpen },
    {
      id: "members",
      group: "Master Data",
      label: role === "admin" ? "Keanggotaan Siswa" : "Daftar Anggota Siswa",
      icon: Users,
    },
  ];
  if (role === "admin") {
    items.push({
      id: "staff",
      group: "Master Data",
      label: "Akun Petugas Layanan",
      icon: ShieldCheck,
    });
  }
  items.push({
    id: "transactions",
    group: "Transaksi",
    label: "Sirkulasi (Pinjam-Kembali)",
    icon: ArrowLeftRight,
  });
  return items;
}

function StaffDashboardInner({ expectedRole }: StaffDashboardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const prefix: StaffRolePrefix = `/${expectedRole}`;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<LibrarySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialSearch ? "books" : "overview");

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchReportSummaryApi(prefix);
      setSummary(data);
    } catch {
      // Abaikan jika ringkasan belum dapat dimuat sesaat.
    }
  }, [prefix]);

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
        if (current.role !== expectedRole) {
          router.replace(getDashboardPath(current.role));
          return;
        }
        setUser(current);
        void loadSummary();
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
  }, [expectedRole, router, loadSummary]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-sm text-(--text-muted)">
          <Loader2 size={18} className="animate-spin text-(--accent-primary)" />
          Memuat Portal {expectedRole === "admin" ? "Admin" : "Petugas"}...
        </div>
      </div>
    );
  }

  return (
    <PortalShell
      user={user}
      portalLabel={
        expectedRole === "admin" ? "Panel Administrator Perpustakaan" : "Panel Petugas Layanan"
      }
      navItems={getStaffNavItems(expectedRole)}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
    >
      {activeTab === "overview" && (
        <ReportsOverviewPanel
          prefix={prefix}
          summary={summary}
          onNavigateTab={setActiveTab}
        />
      )}
      {activeTab === "books" && (
        <CatalogBooksPanel
          role={expectedRole}
          initialSearch={initialSearch}
          onCatalogChanged={() => void loadSummary()}
        />
      )}
      {activeTab === "transactions" && (
        <StaffTransactionsPanel prefix={prefix} onChanged={() => void loadSummary()} />
      )}
      {activeTab === "members" && (
        <UsersManagementPanel
          prefix={prefix}
          kind="members"
          readOnly={expectedRole !== "admin"}
          onChanged={() => void loadSummary()}
        />
      )}
      {activeTab === "staff" && expectedRole === "admin" && (
        <UsersManagementPanel
          prefix="/admin"
          kind="staff"
          readOnly={false}
          onChanged={() => void loadSummary()}
        />
      )}
    </PortalShell>
  );
}

export function StaffDashboardView({ expectedRole }: StaffDashboardViewProps) {
  return (
    <Suspense fallback={null}>
      <StaffDashboardInner expectedRole={expectedRole} />
    </Suspense>
  );
}
