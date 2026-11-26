"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import styles from "./Splash.module.css";

type Props = {
  /** Durasi minimum splash dalam ms (default 4300). */
  minDuration?: number;
  /** true = hanya tampil sekali per sesi browser. */
  once?: boolean;
  /** Isi false sambil menunggu sesuatu (mis. cek sesi ke API Express); splash baru keluar saat true. */
  ready?: boolean;
  /** Dipanggil setelah splash benar-benar hilang. */
  onDone?: () => void;
};

const SPARKS: [string, string, number][] = [
  ["-70px", "-52px", 1.1], ["66px", "-60px", 0.8], ["92px", "6px", 1], ["-88px", "14px", 0.7],
  ["44px", "62px", 0.8], ["-40px", "66px", 1], ["8px", "-84px", 0.7],
];

export default function Splash({ minDuration = 4300, once = false, ready = true, onDone }: Props) {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");
  const flags = useRef({ timeUp: false, loaded: false, ready });
  const check = useRef<() => void>(() => {});
  const leaving = useRef(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  // timer, load, dan tombol Esc/Enter
  useEffect(() => {
    if (once && sessionStorage.getItem("dl-splash")) {
      const skipId = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(skipId);
    }
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const f = flags.current;
    f.timeUp = false;
    f.loaded = document.readyState === "complete";

    const leave = () => {
      if (leaving.current) return;
      leaving.current = true;
      setPhase("leave");
    };
    check.current = () => { if (f.loaded && f.timeUp && f.ready) leave(); };

    const timer = setTimeout(() => { f.timeUp = true; check.current(); }, reduce ? 1200 : minDuration);
    const onLoad = () => { f.loaded = true; check.current(); };
    if (!f.loaded) window.addEventListener("load", onLoad);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") leave(); };
    window.addEventListener("keydown", onKey);
    (window as unknown as { __splashLeave?: () => void }).__splashLeave = leave;

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }, [minDuration, once]);

  // kabar dari prop `ready`
  useEffect(() => { flags.current.ready = ready; check.current(); }, [ready]);

  // setelah animasi pintu selesai, hapus dari DOM
  useEffect(() => {
    if (phase !== "leave") return;
    const id = setTimeout(() => {
      try { sessionStorage.setItem("dl-splash", "1"); } catch {}
      document.documentElement.style.overflow = "";
      setPhase("gone");
      doneRef.current?.();
    }, 1100);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`${styles.splash} ${phase === "leave" ? styles.leave : ""}`} role="status" aria-label="Memuat Denvora Lexora">
      <button
        className={styles.skip}
        type="button"
        onClick={() => (window as unknown as { __splashLeave?: () => void }).__splashLeave?.()}
      >
        Lewati
      </button>
      <div className={styles.stage}>
        <div className={styles.glow} />
        <div className={styles.logo}>
          <span className={styles.ring} />
          <span className={`${styles.ring} ${styles.ring2}`} />
          <img className={styles.mark} src="/splash/logo-mark.png" alt="Denvora Lexora" />
          <img className={styles.star} src="/splash/logo-star.png" alt="" />
          <img className={styles.divider} src="/splash/logo-divider.png" alt="" />
          <img className={styles.denvora} src="/splash/logo-denvora.png" alt="" />
          <img className={styles.lexora} src="/splash/logo-lexora.png" alt="" />
          <img className={styles.tagline} src="/splash/logo-tagline.png" alt="Where Knowledge Finds Its Way." />
          <div className={styles.spark} aria-hidden="true">
            {SPARKS.map(([dx, dy, s], i) => (
              <i key={i} style={{ "--dx": dx, "--dy": dy, "--s": s } as React.CSSProperties} />
            ))}
          </div>
        </div>
        <div className={styles.progress}>
          <div className={styles.bar}><i /></div>
          <small>Memuat perpustakaan</small>
        </div>
      </div>
    </div>
  );
}
