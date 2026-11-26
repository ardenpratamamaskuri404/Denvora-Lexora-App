/**
 * @module lib/useSplashReveal
 * @description Hook ringan untuk menyinkronkan animasi masuk Beranda tepat saat tirai Splash Screen terbuka.
 */

"use client";

import { useEffect, useState } from "react";

/**
 * Mengembalikan `true` segera setelah Splash selesai/mulai terbuka,
 * atau langsung `true` pada navigasi antarhalaman.
 */
export function useSplashReveal(): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const win = window as unknown as { __denvoraSplashDone?: boolean };
    const splashEl = document.querySelector('[role="status"][aria-label="Memuat Denvora Lexora"]');

    if (win.__denvoraSplashDone || !splashEl) {
      const immediateTimer = setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(immediateTimer);
    }

    const revealNow = () => setRevealed(true);
    window.addEventListener("denvora:splash-leaving", revealNow);
    window.addEventListener("denvora:splash-done", revealNow);
    const safetyTimer = setTimeout(revealNow, 5600);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener("denvora:splash-leaving", revealNow);
      window.removeEventListener("denvora:splash-done", revealNow);
    };
  }, []);

  return revealed;
}
