/**
 * @module components/dashboard/PortalNotifications
 * @description Popover notifikasi bel interaktif dengan status terbaca, hapus item, dan tautan ke halaman notifikasi.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Info,
  Trash2,
} from "lucide-react";
import type { PortalNotificationItem } from "@/types/auth";

interface PortalNotificationsProps {
  items: PortalNotificationItem[];
  unreadCount: number;
  busyKey?: string | null;
  onNavigateTab: (tabId: string) => void;
  onOpenNotificationsPage: () => void;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDeleteItem?: (id: string) => void;
}

const LEVEL_STYLES: Record<PortalNotificationItem["level"], string> = {
  danger: "bg-[#9E3B33]/10 text-[#9E3B33] dark:text-[#F5ACA6] border-[#9E3B33]/25",
  warning: "bg-[#9A631A]/10 text-[#9A631A] dark:text-[#E5B87A] border-[#9A631A]/25",
  info: "bg-[#2F6B48]/10 text-[#2F6B48] dark:text-[#9FE0B7] border-[#2F6B48]/25",
};

export function PortalNotifications({
  items,
  unreadCount,
  busyKey = null,
  onNavigateTab,
  onOpenNotificationsPage,
  onMarkRead,
  onMarkAllRead,
  onDeleteItem,
}: PortalNotificationsProps) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const hasUnreadAlerts = items.some(
    (i) => !i.isRead && (i.level === "danger" || i.level === "warning"),
  );
  const isBusy = busyKey !== null;

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifikasi aktivitas perpustakaan"
        title="Notifikasi"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border-subtle) bg-(--bg-primary) text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) transition-colors cursor-pointer"
      >
        <Bell size={16} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs ${
              hasUnreadAlerts ? "bg-[#9E3B33]" : "bg-(--accent-primary)"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 border-b border-(--border-subtle) px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-(--text-primary)">Pusat Notifikasi</p>
                <p className="text-[11px] text-(--text-muted) truncate">
                  {unreadCount > 0
                    ? `${unreadCount} belum dibaca · ${items.length} aktif`
                    : items.length > 0
                      ? `${items.length} notifikasi sudah dibaca`
                      : "Semua status aman dan bersih"}
                </p>
              </div>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={onMarkAllRead}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--bg-primary) px-2 py-1 text-[10px] font-semibold text-(--text-primary) hover:border-(--accent-primary) hover:text-(--accent-primary) disabled:opacity-50 cursor-pointer"
                >
                  <CheckCheck size={12} />
                  Tandai semua
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-(--text-muted) flex flex-col items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#2F6B48]" />
                  <span>Semua status aman, tidak ada notifikasi baru.</span>
                </div>
              ) : (
                items.map((item) => {
                  const Icon = item.level === "info" ? Info : AlertTriangle;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-2.5 transition-colors ${
                        item.isRead
                          ? "border-(--border-subtle) bg-(--bg-primary)/60 opacity-70"
                          : LEVEL_STYLES[item.level]
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.isRead) onMarkRead?.(item.id);
                            onNavigateTab(item.targetTab);
                            setOpen(false);
                          }}
                          className="flex flex-1 min-w-0 items-start gap-2 text-left cursor-pointer"
                        >
                          <Icon size={15} className="shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {!item.isRead && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                              )}
                              <p
                                className={`text-xs leading-snug truncate ${
                                  item.isRead ? "font-medium" : "font-bold"
                                }`}
                              >
                                {item.title}
                              </p>
                            </div>
                            <p className="mt-0.5 text-[11px] opacity-90 leading-snug line-clamp-2">
                              {item.message}
                            </p>
                            <p className="mt-1 text-[10px] opacity-75">{item.timeLabel}</p>
                          </div>
                        </button>

                        <div className="flex items-center gap-0.5 shrink-0">
                          {!item.isRead && onMarkRead && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => onMarkRead(item.id)}
                              title="Tandai dibaca"
                              aria-label={`Tandai ${item.title} sudah dibaca`}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                            >
                              <Check size={12} />
                            </button>
                          )}
                          {onDeleteItem && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => onDeleteItem(item.id)}
                              title="Hapus notifikasi"
                              aria-label={`Hapus ${item.title}`}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#9E3B33] dark:text-[#F5ACA6] hover:bg-[#9E3B33]/15 disabled:opacity-40 cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-(--border-subtle) bg-(--bg-primary)/60 px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  onOpenNotificationsPage();
                  setOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-(--accent-primary) hover:bg-(--accent-primary)/10 transition-colors cursor-pointer"
              >
                Buka Halaman Notifikasi
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
