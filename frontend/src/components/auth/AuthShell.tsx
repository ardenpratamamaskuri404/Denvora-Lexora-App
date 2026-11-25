"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

interface AuthShellProps {
  illustrationSrc: string;
  illustrationAlt: string;
  children: React.ReactNode;
}

function toggleColorTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("denvora-theme", isDark ? "dark" : "light");
  } catch {
    // Abaikan jika penyimpanan lokal dibatasi browser.
  }
}

export function AuthShell({
  illustrationSrc,
  illustrationAlt,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#EFE3D2] via-[#E3D1BA] to-[#C9AE8E] dark:from-[#120C08] dark:via-[#1C120C] dark:to-[#291A12] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <AmbientSparkles />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#A8643A]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#2B1D14]/20 dark:bg-[#C87E4F]/12 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl rounded-[28px] sm:rounded-[34px] overflow-hidden border border-[#D7C7B4]/75 dark:border-[#4A3528] bg-gradient-to-br from-[#3F2719] via-[#2B1D14] to-[#1A100A] shadow-[0_28px_80px_rgba(43,29,20,0.28)] grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="relative lg:col-span-6 text-[#2B1D14] flex flex-col justify-between p-6 sm:p-8 lg:pr-16">
          <div className="lg:hidden absolute inset-0 bg-[#FBF7F1]" aria-hidden="true" />
          <div
            className="hidden lg:block absolute inset-y-0 left-0 right-16 bg-[#FBF7F1]"
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 90 800"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 h-full w-16"
          >
            <path
              d="M0 0 L58 0 C-10 230 78 590 18 800 L0 800 Z"
              fill="#FBF7F1"
            />
            <path
              d="M58 0 C-10 230 78 590 18 800"
              fill="none"
              stroke="#A8643A"
              strokeOpacity="0.38"
              strokeWidth="3"
            />
          </svg>

          <div className="relative z-10 flex items-center justify-between gap-3">
            <Link
              href="/"
              aria-label="Kembali ke Beranda Denvora Lexora"
              className="flex items-center overflow-hidden h-10 sm:h-11"
            >
              <Image
                src="/images/denvora-lexora-logo.png"
                alt="Logo Denvora Lexora"
                width={260}
                height={173}
                priority
                className="h-[68px] sm:h-[76px] w-auto object-contain mix-blend-multiply"
              />
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleColorTheme}
                aria-label="Ubah mode gelap atau terang"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D7C7B4] bg-[#F6EFE6] text-[#2B1D14] hover:bg-[#E9DCCB] cursor-pointer"
              >
                <Moon size={14} strokeWidth={1.75} className="block dark:hidden" />
                <Sun size={14} strokeWidth={1.75} className="hidden dark:block" />
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-full border border-[#D7C7B4] bg-[#F6EFE6] px-3 py-1.5 text-xs font-semibold text-[#2B1D14] hover:bg-[#E9DCCB] transition-colors"
              >
                <ArrowLeft size={13} strokeWidth={1.75} />
                Beranda
              </Link>
            </div>
          </div>

          <div className="relative z-10 my-5 sm:my-6 flex items-center justify-center">
            <div className="relative w-full max-w-[310px] sm:max-w-[350px] aspect-[7/8] rounded-3xl overflow-hidden border border-[#E9DCCB] bg-[#F3E8D9] shadow-sm">
              <Image
                src={illustrationSrc}
                alt={illustrationAlt}
                width={840}
                height={960}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8C7B6B] pt-2">
            <span>© 2026 Denvora Lexora</span>
            <span>Perpustakaan Digital Sekolah</span>
          </div>
        </div>

        <div className="relative lg:col-span-6 text-[#F6EFE6] p-7 sm:p-10 lg:pl-8 flex flex-col justify-center">
          <svg
            viewBox="0 0 600 44"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="lg:hidden pointer-events-none absolute -top-px left-0 w-full h-7"
          >
            <path d="M0 0 L600 0 L600 18 C420 44 180 0 0 32 Z" fill="#FBF7F1" />
          </svg>

          <div className="relative z-10 w-full max-w-md mx-auto pt-4 lg:pt-0">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
