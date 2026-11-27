/**
 * @module components/auth/AuthShell
 * @description Layout full-layar terbelah kurva Cream Mocha yang tersinkron dengan tema Light/Dark global.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface AuthShellProps {
  illustrationSrc: string;
  illustrationAlt: string;
  wideForm?: boolean;
  children: React.ReactNode;
}

export function AuthShell({
  illustrationSrc,
  illustrationAlt,
  wideForm = false,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden w-full overflow-x-hidden bg-gradient-to-br from-[#3F2719] via-[#2B1D14] to-[#1A100A] dark:from-[#1B110B] dark:via-[#120B07] dark:to-[#090503] grid grid-cols-1 lg:grid-cols-12 transition-colors">
      <div className="relative lg:col-span-6 lg:h-full text-[#2B1D14] dark:text-[#F6EFE6] flex flex-col justify-between p-5 sm:p-6 lg:py-5 lg:pl-8 xl:pl-12 lg:pr-20 xl:pr-24">
        <div
          className="lg:hidden absolute inset-0 bg-[#FBF7F1] dark:bg-[#241913] transition-colors"
          aria-hidden="true"
        />
        <div
          className="hidden lg:block absolute inset-y-0 left-0 right-20 bg-[#FBF7F1] dark:bg-[#241913] transition-colors"
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 110 900"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 h-full w-20 xl:w-24"
        >
          <path
            d="M0 0 L72 0 C-12 260 94 640 22 900 L0 900 Z"
            className="fill-[#FBF7F1] dark:fill-[#241913] transition-colors"
          />
          <path
            d="M72 0 C-12 260 94 640 22 900"
            fill="none"
            strokeWidth="3"
            className="stroke-[#A8643A]/35 dark:stroke-[#C87E4F]/50 transition-colors"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between gap-4 shrink-0">
          <Link
            href="/"
            aria-label="Kembali ke Beranda Denvora Lexora"
            className="flex items-center overflow-hidden h-9 sm:h-10 rounded-full dark:bg-[#FBF7F1] dark:px-3"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={280}
              height={186}
              priority
              className="h-[58px] sm:h-[68px] w-auto object-contain mix-blend-multiply"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5D4C3F] dark:text-[#E9DCCB] hover:text-[#A8643A] dark:hover:text-[#C87E4F] transition-colors shrink-0"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
            <span>Beranda</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 my-2 lg:my-0 flex-1 min-h-0 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[440px] lg:max-h-[calc(100dvh-120px)] aspect-[84/94]">
            <Image
              unoptimized
              src={`${illustrationSrc}?v=4`}
              alt={illustrationAlt}
              width={840}
              height={940}
              priority
              className="h-full w-full max-h-full object-contain drop-shadow-[0_18px_36px_rgba(43,29,20,0.08)]"
            />
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8C7B6B] dark:text-[#C2B09E] pt-1 shrink-0">
          <span>© 2026 Denvora Lexora</span>
          <span>Where Knowledge Finds Its Way.</span>
        </div>
      </div>

      <div className="relative lg:col-span-6 lg:h-full lg:overflow-y-auto text-[#F6EFE6] p-6 sm:p-8 lg:px-10 xl:px-12 lg:py-5 flex flex-col justify-center">
        <svg
          viewBox="0 0 600 44"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="lg:hidden pointer-events-none absolute -top-px left-0 w-full h-7"
        >
          <path
            d="M0 0 L600 0 L600 18 C420 44 180 0 0 32 Z"
            className="fill-[#FBF7F1] dark:fill-[#241913] transition-colors"
          />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 w-full mx-auto pt-3 lg:pt-0 ${
            wideForm ? "max-w-[560px]" : "max-w-[500px]"
          }`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
