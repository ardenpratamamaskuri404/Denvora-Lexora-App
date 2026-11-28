/**
 * @module components/dashboard/PortalShell
 * @description Kerangka dashboard profesional dengan toggle garis 3, searchbar real-time, notifikasi, dan menu dropdown profil.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, LogOut, Menu, Moon, Sun, X, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PortalGlobalSearch } from "@/components/dashboard/PortalGlobalSearch";
import { PortalNotifications } from "@/components/dashboard/PortalNotifications";
import { PortalNavList, PortalSidebar } from "@/components/dashboard/PortalSidebar";
import { PortalUserMenu } from "@/components/dashboard/PortalUserMenu";
import { logoutApi } from "@/lib/api";
import type { NotificationActionControls } from "@/lib/useRealtimeSync";
import type { AuthUser, PortalNotificationItem } from "@/types/auth";

export interface PortalNavItem {
  id: string;
  label: string;
  group?: string;
  icon: LucideIcon;
  badge?: number;
}

interface PortalShellProps {
  user: AuthUser;
  portalLabel: string;
  portalSubtitle: string;
  navItems: PortalNavItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onQuickSearch: (keyword: string) => void;
  notifications?: PortalNotificationItem[];
  unreadNotificationsCount?: number;
  notificationActions?: NotificationActionControls;
  children: React.ReactNode;
}

function togglePortalTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("denvora-theme", isDark ? "dark" : "light");
  } catch {
    // Abaikan jika localStorage dibatasi browser.
  }
}

function formatTodayId(): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export function PortalShell({
  user,
  portalLabel,
  portalSubtitle,
  navItems,
  activeTab,
  onSelectTab,
  onQuickSearch,
  notifications = [],
  unreadNotificationsCount,
  notificationActions,
  children,
}: PortalShellProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const todayLabel = formatTodayId();
  const activeItem = navItems.find((item) => item.id === activeTab);
  const resolvedUnreadCount =
    unreadNotificationsCount ?? notifications.filter((n) => !n.isRead).length;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      router.replace("/login");
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-col lg:flex-row transition-colors">
      <PortalSidebar
        portalLabel={portalLabel}
        portalSubtitle={portalSubtitle}
        navItems={navItems}
        activeTab={activeTab}
        collapsed={collapsed}
        loggingOut={loggingOut}
        onSelectTab={onSelectTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-(--border-subtle) bg-(--surface-elevated)/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                aria-label="Buka menu navigasi"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) cursor-pointer"
              >
                {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>

              <button
                type="button"
                aria-label={collapsed ? "Buka sidebar penuh" : "Lipat sidebar"}
                title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                onClick={() => setCollapsed((prev) => !prev)}
                className="hidden lg:inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) transition-colors cursor-pointer"
              >
                <Menu size={17} strokeWidth={1.9} />
              </button>

              <PortalGlobalSearch role={user.role} onSelectQuery={onQuickSearch} />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="default" className="hidden xl:inline-flex gap-1.5 tabular-nums">
                <Calendar size={12} /> {todayLabel}
              </Badge>

              <PortalNotifications
                items={notifications}
                unreadCount={resolvedUnreadCount}
                busyKey={notificationActions?.busyKey}
                onNavigateTab={onSelectTab}
                onOpenNotificationsPage={() => onSelectTab("notifications")}
                onMarkRead={notificationActions?.onMarkRead}
                onMarkAllRead={notificationActions?.onMarkAllRead}
                onDeleteItem={notificationActions?.onDeleteItem}
              />

              <button
                type="button"
                onClick={togglePortalTheme}
                aria-label="Ubah mode gelap atau terang"
                title="Mode Gelap / Terang"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) cursor-pointer"
              >
                <Moon size={15} className="block dark:hidden" />
                <Sun size={15} className="hidden dark:block" />
              </button>

              <PortalUserMenu
                user={user}
                loggingOut={loggingOut}
                onNavigateTab={onSelectTab}
                onLogout={handleLogout}
              />
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden mt-3 rounded-2xl bg-[#2B1D14] dark:bg-[#140D09] p-3 text-[#F6EFE6]"
              >
                <PortalNavList
                  navItems={navItems}
                  activeTab={activeTab}
                  mini={false}
                  onSelect={(tabId) => {
                    onSelectTab(tabId);
                    setMobileMenuOpen(false);
                  }}
                />
                <div className="mt-3 pt-2.5 border-t border-[#4A3528] flex items-center justify-between gap-2">
                  <Link href="/" className="text-xs text-[#E9DCCB] px-2 py-1">
                    Beranda Publik
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center gap-1 rounded-full bg-[#9E3B33] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    <LogOut size={13} /> Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--accent-primary)">
                {portalLabel}
              </p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-(--text-primary)">
                {activeItem?.label || portalLabel}
              </h1>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
