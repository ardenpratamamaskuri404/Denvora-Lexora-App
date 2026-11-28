/**
 * @module lib/useRealtimeSync
 * @description Hook sinkronisasi real-time antar peran dan tab browser melalui polling berkala, fokus tab, dan BroadcastChannel.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearNotificationsApi,
  deleteNotificationApi,
  formatApiError,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "@/lib/api";

const CHANNEL_NAME = "denvora-lexora-realtime";

/**
 * Mengirim sinyal perubahan data ke seluruh tab/portal yang sedang terbuka.
 */
export function broadcastPortalSync(topic = "all"): void {
  if (typeof window === "undefined") return;
  try {
    const ch = new BroadcastChannel(CHANNEL_NAME);
    ch.postMessage({ topic, ts: Date.now() });
    ch.close();
  } catch {
    // Abaikan jika browser membatasi BroadcastChannel.
  }
}

/**
 * Menjalankan sinkronisasi otomatis berkala, saat jendela kembali aktif, dan saat ada sinyal mutasi dari tab lain.
 */
export function useRealtimeSync(onSync: () => void | Promise<void>, intervalMs = 8000): void {
  const callbackRef = useRef(onSync);
  useEffect(() => {
    callbackRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    const run = () => {
      void callbackRef.current();
    };

    const timer = window.setInterval(run, intervalMs);
    const onFocus = () => run();
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = () => run();
    } catch {
      channel = null;
    }

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      channel?.close();
    };
  }, [intervalMs]);
}

export interface NotificationActionControls {
  busyKey: string | null;
  actionError: string;
  onMarkRead: (key: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  onDeleteItem: (key: string) => Promise<void>;
  onClearItems: (mode: "read" | "all") => Promise<void>;
}

/**
 * Mengelola aksi baca/hapus notifikasi sekaligus memicu sinkronisasi lintas komponen & tab.
 */
export function useNotificationActions(
  onRefresh: () => void | Promise<void>,
): NotificationActionControls {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const refreshRef = useRef(onRefresh);

  useEffect(() => {
    refreshRef.current = onRefresh;
  }, [onRefresh]);

  const runAction = useCallback(
    async (actionKey: string, task: () => Promise<unknown>) => {
      if (busyKey) return;
      setBusyKey(actionKey);
      setActionError("");
      try {
        await task();
        broadcastPortalSync("notifications");
        await refreshRef.current();
      } catch (err) {
        setActionError(formatApiError(err, "Gagal memperbarui status notifikasi."));
      } finally {
        setBusyKey(null);
      }
    },
    [busyKey],
  );

  const onMarkRead = useCallback(
    (key: string) => runAction(`read:${key}`, () => markNotificationReadApi(key)),
    [runAction],
  );
  const onMarkAllRead = useCallback(
    () => runAction("read-all", () => markAllNotificationsReadApi()),
    [runAction],
  );
  const onDeleteItem = useCallback(
    (key: string) => runAction(`del:${key}`, () => deleteNotificationApi(key)),
    [runAction],
  );
  const onClearItems = useCallback(
    (mode: "read" | "all") => runAction(`clear:${mode}`, () => clearNotificationsApi(mode)),
    [runAction],
  );

  return {
    busyKey,
    actionError,
    onMarkRead,
    onMarkAllRead,
    onDeleteItem,
    onClearItems,
  };
}
