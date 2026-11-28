/**
 * @module components/dashboard/StaffDashboardView
 * @description Portal real-time Petugas & Admin dengan sidebar lipat, notifikasi langsung, grafik Recharts, dan pengaturan akun.
 */

"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftRight,
  Bell,
  BookOpen,
  LayoutDashboard,
  Loader2,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { fetchNotificationsApi, meApi } from "@/lib/api";
import { fetchReportSummaryApi } from "@/lib/portalApi";
import {
  broadcastPortalSync,
  useNotificationActions,
  useRealtimeSync,
} from "@/lib/useRealtimeSync";
import { PortalShell, type PortalNavItem } from "@/components/dashboard/PortalShell";
import { ReportsOverviewPanel } from "@/components/dashboard/ReportsOverviewPanel";
import { CatalogBooksPanel } from "@/components/dashboard/CatalogBooksPanel";
import { StaffTransactionsPanel } from "@/components/dashboard/StaffTransactionsPanel";
import { UsersManagementPanel } from "@/components/dashboard/UsersManagementPanel";
import { NotificationsPagePanel } from "@/components/dashboard/NotificationsPagePanel";
import { AccountSettingsPanel } from "@/components/dashboard/AccountSettingsPanel";
import { getDashboardPath, type AuthUser, type PortalNotificationItem } from "@/types/auth";
import type { LibrarySummary, StaffRolePrefix } from "@/types/library";

interface StaffDashboardViewProps {
  expectedRole: "admin" | "petugas";
}

function getStaffNavItems(role: "admin" | "petugas", unreadCount: number): PortalNavItem[] {
  const items: PortalNavItem[] = [
    { id: "overview", group: "Utama", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", group: "Master Data", label: "Buku & Kategori", icon: BookOpen },
    {
      id: "members",
      group: "Master Data",
      label: role === "admin" ? "Anggota Siswa" : "Daftar Siswa",
      icon: Users,
    },
  ];
  if (role === "admin") {
    items.push({
      id: "staff",
      group: "Master Data",
      label: "Akun Petugas",
      icon: ShieldCheck,
    });
  }
  items.push(
    { id: "transactions", group: "Sirkulasi", label: "Sirkulasi Buku", icon: ArrowLeftRight },
    { id: "notifications", group: "Akun", label: "Notifikasi", icon: Bell, badge: unreadCount },
    { id: "settings", group: "Akun", label: "Pengaturan", icon: Settings }
  );
  return items;
}

function StaffDashboardInner({ expectedRole }: StaffDashboardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialTabParam = searchParams.get("tab");
  const prefix: StaffRolePrefix = `/${expectedRole}`;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<LibrarySummary | null>(null);
  const [notifications, setNotifications] = useState<PortalNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [quickSearch, setQuickSearch] = useState(initialSearch);
  const [searchNonce, setSearchNonce] = useState(0);
  const [activeTab, setActiveTab] = useState(
    initialSearch
      ? "books"
      : initialTabParam === "settings" || initialTabParam === "transactions" || initialTabParam === "books" || initialTabParam === "notifications"
        ? initialTabParam
        : "overview"
  );

  const loadSummary = useCallback(async () => {
    try {
      const [data, notifRes] = await Promise.all([
        fetchReportSummaryApi(prefix),
        fetchNotificationsApi().catch(() => null),
      ]);
      setSummary(data);
      if (notifRes?.data) {
        setNotifications(notifRes.data.items);
        setUnreadCount(notifRes.data.unreadCount);
      }
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

  const handleRealtimeTick = useCallback(() => {
    if (!user) return;
    setRefreshSignal((s) => s + 1);
    void loadSummary();
  }, [user, loadSummary]);

  useRealtimeSync(handleRealtimeTick, 8000);
  const notifActions = useNotificationActions(loadSummary);

  function handleDataChanged() {
    setRefreshSignal((s) => s + 1);
    broadcastPortalSync("staff-mutation");
    void loadSummary();
  }

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
      portalSubtitle={
        expectedRole === "admin" ? "Kendali Sistem & Sirkulasi" : "Operasional Sirkulasi & Katalog"
      }
      navItems={getStaffNavItems(expectedRole, unreadCount)}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onQuickSearch={(kw) => {
        setQuickSearch(kw);
        setSearchNonce((n) => n + 1);
        setActiveTab("books");
      }}
      notifications={notifications}
      unreadNotificationsCount={unreadCount}
      notificationActions={notifActions}
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
          key={`staff-cat-${searchNonce}`}
          role={expectedRole}
          initialSearch={quickSearch}
          refreshSignal={refreshSignal}
          onCatalogChanged={handleDataChanged}
        />
      )}
      {activeTab === "transactions" && (
        <StaffTransactionsPanel
          prefix={prefix}
          refreshSignal={refreshSignal}
          onChanged={handleDataChanged}
        />
      )}
      {activeTab === "members" && (
        <UsersManagementPanel
          prefix={prefix}
          kind="members"
          readOnly={expectedRole !== "admin"}
          refreshSignal={refreshSignal}
          onChanged={handleDataChanged}
        />
      )}
      {activeTab === "staff" && expectedRole === "admin" && (
        <UsersManagementPanel
          prefix="/admin"
          kind="staff"
          readOnly={false}
          refreshSignal={refreshSignal}
          onChanged={handleDataChanged}
        />
      )}
      {activeTab === "notifications" && (
        <NotificationsPagePanel
          items={notifications}
          unreadCount={unreadCount}
          onNavigateTab={setActiveTab}
          {...notifActions}
        />
      )}
      {activeTab === "settings" && (
        <AccountSettingsPanel user={user} onUserUpdated={setUser} />
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
