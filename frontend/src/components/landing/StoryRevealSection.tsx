"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Pause, Play, Sparkles } from "lucide-react";

const STORY_SCENES = [
  {
    step: "01",
    title: "Daftar Anggota Mandiri",
    caption:
      "Siswa baru mendaftarkan NIS dan akun perpustakaan secara langsung sebelum mengakses katalog.",
    image: "/images/denvora-register-web.svg",
  },
  {
    step: "02",
    title: "Masuk Sesuai Peran",
    caption:
      "Satu gerbang login aman untuk Siswa, Petugas piket, dan Admin pengelola penuh.",
    image: "/images/denvora-login-web.svg",
  },
  {
    step: "03",
    title: "Sirkulasi Buku Real-Time",
    caption:
      "Stok buku tercatat akurat saat peminjaman dan otomatis pulih ketika buku dikembalikan.",
    image: "/images/denvora-landing-hero.svg",
  },
];

export function StoryRevealSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const leftWordX = useTransform(scrollYProgress, [0, 0.65], ["0vw", "-26vw"]);
  const rightWordX = useTransform(scrollYProgress, [0, 0.65], ["0vw", "26vw"]);
  const wordOpacity = useTransform(scrollYProgress, [0.35, 0.78], [1, 0.12]);
  const frameScale = useTransform(scrollYProgress, [0.05, 0.72], [0.58, 1]);
  const frameRadius = useTransform(scrollYProgress, [0.05, 0.72], [28, 20]);
  const welcomeY = useTransform(scrollYProgress, [0.35, 0.85], [32, 0]);
  const welcomeOpacity = useTransform(scrollYProgress, [0.35, 0.8], [0, 1]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % STORY_SCENES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [playing]);

  const currentScene = STORY_SCENES[sceneIndex];

  return (
    <section
      id="cerita"
      ref={containerRef}
      className="relative h-[195vh] bg-[#F6EFE6]"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-20">
        <div className="relative flex w-full max-w-5xl items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-2 sm:gap-4 select-none">
            <motion.span
              style={{ x: leftWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[#A8643A] sm:text-7xl md:text-8xl"
            >
              CER
            </motion.span>
            <motion.span
              style={{ x: rightWordX, opacity: wordOpacity }}
              className="font-editorial text-5xl font-bold tracking-wider text-[#A8643A] sm:text-7xl md:text-8xl"
            >
              ITA
            </motion.span>
          </div>

          <motion.div
            style={{ scale: frameScale, borderRadius: frameRadius }}
            className="relative z-10 w-full max-w-4xl overflow-hidden border-2 border-[#D7C7B4] bg-[#FBF7F1] shadow-[0_24px_60px_rgba(43,29,20,0.16)]"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/9] w-full overflow-hidden bg-[#E9DCCB]">
              <motion.img
                key={currentScene.image}
                src={currentScene.image}
                alt={currentScene.title}
                width={1280}
                height={720}
                initial={{ opacity: 0.4, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1D14]/82 via-[#2B1D14]/25 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 text-[#F6EFE6] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A8643A] px-3 py-1 text-xs font-semibold">
                    <Sparkles size={12} strokeWidth={1.75} />
                    Babak {currentScene.step}
                  </span>
                  <h3 className="font-editorial mt-2 text-xl font-bold sm:text-2xl">
                    {currentScene.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#F6EFE6]/90 leading-relaxed">
                    {currentScene.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Jeda animasi cerita" : "Putar animasi cerita"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F6EFE6] text-[#2B1D14] hover:bg-[#E9DCCB] cursor-pointer"
                  >
                    {playing ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  {STORY_SCENES.map((scene, idx) => (
                    <button
                      key={scene.step}
                      type="button"
                      onClick={() => setSceneIndex(idx)}
                      aria-label={`Pilih babak ${scene.step}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === sceneIndex
                          ? "w-7 bg-[#A8643A]"
                          : "w-2.5 bg-[#F6EFE6]/60 hover:bg-[#F6EFE6]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: welcomeY, opacity: welcomeOpacity }}
          className="mt-7 text-center max-w-2xl px-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8643A]">
            Selamat Datang di Denvora Lexora
          </p>
          <p className="font-editorial mt-1.5 text-xl font-semibold text-[#2B1D14] sm:text-2xl">
            Setiap buku menemukan pembacanya, setiap transaksi tercatat rapi.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
