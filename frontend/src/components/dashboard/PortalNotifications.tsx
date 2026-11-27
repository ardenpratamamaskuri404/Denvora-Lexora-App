/**
 * @module components/dashboard/PortalNotifications
 * @description Ikon notifikasi bel interaktif dengan lencana real-time dan daftar peringatan peran aktif.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Bell, CheckCircle2, Info } from "lucide-react";
import type { PortalNotificationItem } from "@/types/auth";

interface PortalNotificationsProps {
  items: PortalNotificationItem[];
  onNavigateTab: (tabId: string) => void;
}

const LEVEL_STYLES: Record<PortalNotificationItem["level"], string> = {
  danger: "bg-[#9E3B33]/12 text-[#9E3B33] dark:text-[#F5ACA6] border-[#9E3B33]/25",
  warning: "bg-[#9A631A]/12 text-[#9A631A] dark:text-[#E5B87A] border-[#9A631A]/25",
  info: "bg-[#2F6B48]/12 text-[#2F6B48] dark:text-[#9FE0B7] border-[#2F6B48]/25",
};

export function PortalNotifications({
  items,
  onNavigateTab,
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

  const hasAlerts = items.some((i) => i.level === "danger" || i.level === "warning");

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
        {items.length > 0 && (
          <span
            className={`absolute -top-1 -right-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs ${
              hasAlerts ? "bg-[#9E3B33]" : "bg-(--accent-primary)"
            }`}
          >
            {items.length > 9 ? "9+" : items.length}
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
            <div className="flex items-center justify-between border-b border-(--border-subtle) px-4 py-3">
              <div>
                <p className="text-xs font-bold text-(--text-primary)">Pusat Notifikasi</p>
                <p className="text-[11px] text-(--text-muted)">
                  Pemantauan langsung status sirkulasi &amp; stok
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2F6B48]/15 px-2 py-0.5 text-[10px] font-semibold text-[#2F6B48] dark:text-[#9FE0B7]">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                Live
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-(--text-muted) flex flex-col items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#2F6B48]" />
                  <span>Semua status aman, tidak ada peringatan baru.</span>
                </div>
              ) : (
                items.map((item) => {
                  const Icon = item.level === "info" ? Info : AlertTriangle;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigateTab(item.targetTab);
                        setOpen(false);
                      }}
                      className={`w-full text-left rounded-xl border p-2.5 transition-colors hover:brightness-95 cursor-pointer ${LEVEL_STYLES[item.level]}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Icon size={15} className="shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-snug">{item.title}</p>
                          <p className="mt-0.5 text-[11px] opacity-90 leading-snug">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
