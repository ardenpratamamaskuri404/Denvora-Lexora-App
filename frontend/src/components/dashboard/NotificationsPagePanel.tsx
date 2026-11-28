/**
 * @module components/dashboard/NotificationsPagePanel
 * @description Halaman penuh manajemen notifikasi untuk membaca, memfilter, mencari, menghapus item, dan membuka halaman terkait.
 */

"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Info,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortalNotificationItem } from "@/types/auth";

export interface NotificationsPagePanelProps {
  items: PortalNotificationItem[];
  unreadCount: number;
  busyKey: string | null;
  actionError?: string;
  onNavigateTab: (tabId: string) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteItem: (id: string) => void;
  onClearItems: (mode: "read" | "all") => void;
}

type FilterMode = "all" | "unread" | "read";

const TARGET_LABELS: Record<string, string> = {
  transactions: "Sirkulasi Buku",
  books: "Buku & Kategori",
  members: "Data Siswa",
  staff: "Akun Petugas",
  loans: "Pinjam & Kembali",
  catalog: "Katalog Buku",
};

const LEVEL_BADGE: Record<
  PortalNotificationItem["level"],
  { label: string; badgeClass: string; borderClass: string }
> = {
  danger: {
    label: "Penting",
    badgeClass: "bg-[#9E3B33]/12 text-[#9E3B33] dark:text-[#F5ACA6] border-[#9E3B33]/30",
    borderClass: "border-[#9E3B33]/35 bg-[#9E3B33]/[0.04]",
  },
  warning: {
    label: "Perhatian",
    badgeClass: "bg-[#9A631A]/12 text-[#9A631A] dark:text-[#E5B87A] border-[#9A631A]/30",
    borderClass: "border-[#9A631A]/35 bg-[#9A631A]/[0.04]",
  },
  info: {
    label: "Informasi",
    badgeClass: "bg-[#2F6B48]/12 text-[#2F6B48] dark:text-[#9FE0B7] border-[#2F6B48]/30",
    borderClass: "border-[#2F6B48]/30 bg-[#2F6B48]/[0.04]",
  },
};

export function NotificationsPagePanel({
  items,
  unreadCount,
  busyKey,
  actionError = "",
  onNavigateTab,
  onMarkRead,
  onMarkAllRead,
  onDeleteItem,
  onClearItems,
}: NotificationsPagePanelProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [query, setQuery] = useState("");
  const readCount = Math.max(0, items.length - unreadCount);
  const isBusy = busyKey !== null;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "unread" && item.isRead) return false;
      if (filter === "read" && !item.isRead) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.timeLabel.toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/12 text-(--accent-primary)">
            <Bell size={18} />
          </div>
          <div>
            <CardTitle>Pusat Notifikasi</CardTitle>
            <CardDescription>
              {unreadCount} belum dibaca &middot; {items.length} notifikasi aktif
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" disabled={isBusy || unreadCount === 0} onClick={onMarkAllRead}>
            <CheckCheck size={14} /> Tandai Semua Dibaca
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={isBusy || readCount === 0} onClick={() => onClearItems("read")}>
            <Trash2 size={14} /> Hapus yang Dibaca
          </Button>
          <Button type="button" size="sm" variant="destructive" disabled={isBusy || items.length === 0} onClick={() => onClearItems("all")}>
            <Trash2 size={14} /> Bersihkan Semua
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {actionError && (
          <div className="rounded-xl border border-[#9E3B33]/35 bg-[#9E3B33]/10 px-3.5 py-2.5 text-xs text-[#9E3B33] dark:text-[#F5ACA6]">
            {actionError}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--bg-primary) p-1">
            {(
              [
                { id: "all", label: `Semua (${items.length})` },
                { id: "unread", label: `Belum Dibaca (${unreadCount})` },
                { id: "read", label: `Sudah Dibaca (${readCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  filter === tab.id
                    ? "bg-(--accent-primary) text-[#F6EFE6] shadow-xs"
                    : "text-(--text-muted) hover:text-(--text-primary)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari isi notifikasi..."
              aria-label="Cari notifikasi"
              className="h-9 w-full rounded-xl border border-(--border-subtle) bg-(--bg-primary) pl-9 pr-3 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)"
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-(--border-subtle) py-12 px-4 text-center flex flex-col items-center gap-2.5">
            <CheckCircle2 size={28} className="text-[#2F6B48]" />
            <p className="text-sm font-semibold text-(--text-primary)">
              {items.length === 0 ? "Tidak ada notifikasi aktif" : "Tidak ada notifikasi yang sesuai filter"}
            </p>
            <p className="max-w-md text-xs text-(--text-muted)">
              {items.length === 0
                ? "Semua status sirkulasi dan stok dalam kondisi aman, atau seluruh notifikasi telah dibersihkan."
                : "Ubah tab filter atau kata kunci pencarian untuk melihat daftar notifikasi lainnya."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const Icon = item.level === "info" ? Info : AlertTriangle;
              const style = LEVEL_BADGE[item.level];
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    item.isRead
                      ? "border-(--border-subtle) bg-(--bg-primary)/60 opacity-75"
                      : `${style.borderClass} ring-1 ring-(--accent-primary)/15`
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${style.badgeClass}`}>
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {!item.isRead && <span className="h-2 w-2 rounded-full bg-(--accent-primary)" title="Belum dibaca" />}
                          <p className={`text-sm leading-snug text-(--text-primary) ${item.isRead ? "font-semibold" : "font-bold"}`}>
                            {item.title}
                          </p>
                          <Badge variant={item.level === "info" ? "success" : item.level} className="text-[10px]">
                            {style.label}
                          </Badge>
                          {item.isRead && <span className="text-[11px] font-medium text-(--text-muted)">Dibaca</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-(--text-muted)">{item.message}</p>
                        <p className="inline-flex items-center gap-1.5 text-[11px] text-(--text-muted)">
                          <Clock size={11} /> {item.timeLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 sm:pl-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!item.isRead) void onMarkRead(item.id);
                          onNavigateTab(item.targetTab);
                        }}
                      >
                        {TARGET_LABELS[item.targetTab] || "Buka Halaman"} <ArrowRight size={13} />
                      </Button>
                      {!item.isRead && (
                        <Button type="button" size="sm" variant="secondary" disabled={isBusy} onClick={() => onMarkRead(item.id)}>
                          <Check size={14} /> Tandai Dibaca
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => onDeleteItem(item.id)}
                        aria-label={`Hapus notifikasi ${item.title}`}
                        title="Hapus notifikasi"
                        className="text-[#9E3B33] hover:bg-[#9E3B33]/10 dark:text-[#F5ACA6]"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
