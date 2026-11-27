/**
 * @module lib/useRealtimeSync
 * @description Hook sinkronisasi real-time antar peran dan tab browser melalui polling berkala, fokus tab, dan BroadcastChannel.
 */

"use client";

import { useEffect, useRef } from "react";

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
