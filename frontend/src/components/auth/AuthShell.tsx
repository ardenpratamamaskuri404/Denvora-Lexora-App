"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface AuthShellProps {
  illustrationSrc: string;
  illustrationAlt: string;
  children: React.ReactNode;
}

export function AuthShell({
  illustrationSrc,
  illustrationAlt,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#3F2719] via-[#2B1D14] to-[#1A100A] grid grid-cols-1 lg:grid-cols-12">
      <div className="relative lg:col-span-6 text-[#2B1D14] flex flex-col justify-between p-6 sm:p-10 lg:pr-24">
        <div className="lg:hidden absolute inset-0 bg-[#FBF7F1]" aria-hidden="true" />
        <div
          className="hidden lg:block absolute inset-y-0 left-0 right-20 bg-[#FBF7F1]"
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
            fill="#FBF7F1"
          />
          <path
            d="M72 0 C-12 260 94 640 22 900"
            fill="none"
            stroke="#A8643A"
            strokeOpacity="0.35"
            strokeWidth="3"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Kembali ke Beranda Denvora Lexora"
            className="flex items-center overflow-hidden h-11 sm:h-12"
          >
            <Image
              src="/images/denvora-lexora-logo.png"
              alt="Logo Denvora Lexora"
              width={280}
              height={186}
              priority
              className="h-[74px] sm:h-[82px] w-auto object-contain mix-blend-multiply"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5D4C3F] hover:text-[#A8643A] transition-colors shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            <span>Beranda</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 my-6 lg:my-8 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[390px] lg:max-w-[440px] aspect-[7/8] rounded-3xl overflow-hidden border border-[#E9DCCB] bg-[#F3E8D9] shadow-sm">
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              width={840}
              height={960}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between text-xs text-[#8C7B6B] pt-2">
          <span>© 2026 Denvora Lexora</span>
          <span>Where Knowledge Finds Its Way.</span>
        </div>
      </div>

      <div className="relative lg:col-span-6 text-[#F6EFE6] p-7 sm:p-12 lg:p-14 flex flex-col justify-center">
        <svg
          viewBox="0 0 600 44"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="lg:hidden pointer-events-none absolute -top-px left-0 w-full h-7"
        >
          <path d="M0 0 L600 0 L600 18 C420 44 180 0 0 32 Z" fill="#FBF7F1" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md mx-auto pt-4 lg:pt-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
