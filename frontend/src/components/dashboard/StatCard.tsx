/**
 * @module components/dashboard/StatCard
 * @description Kartu KPI bergaya shadcn/ui dengan animasi Motion lembut dan tombol aksi cepat.
 */

"use client";

import { motion } from "motion/react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  tone?: "default" | "accent" | "danger" | "success" | "warning";
  actionLabel?: string;
  onAction?: () => void;
  delay?: number;
}

const SURFACE_MAP = {
  default:
    "bg-(--surface-elevated) text-(--text-primary) border-(--border-subtle)",
  accent:
    "bg-gradient-to-br from-[#A8643A] to-[#874B27] text-[#FBF7F1] border-[#874B27]",
  success:
    "bg-gradient-to-br from-[#2F6B48] to-[#235237] text-[#F6EFE6] border-[#235237]",
  warning:
    "bg-gradient-to-br from-[#B57B27] to-[#946017] text-[#FBF7F1] border-[#946017]",
  danger:
    "bg-gradient-to-br from-[#9E3B33] to-[#7D2C26] text-[#F6EFE6] border-[#7D2C26]",
};

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = "default",
  actionLabel,
  onAction,
  delay = 0,
}: StatCardProps) {
  const isSolid = tone !== "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className={`relative h-full overflow-hidden flex flex-col justify-between ${SURFACE_MAP[tone]}`}>
        <div className="p-5 flex items-start justify-between gap-3">
          <div className="relative z-10">
            <motion.p
              key={String(value)}
              initial={{ opacity: 0.5, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="font-editorial text-3xl sm:text-[2rem] font-bold leading-none tabular-nums"
            >
              {value}
            </motion.p>
            <p
              className={`mt-2 text-xs font-semibold ${
                isSolid ? "text-white/95" : "text-(--text-primary)"
              }`}
            >
              {label}
            </p>
            {sublabel && (
              <p
                className={`mt-1 text-[11px] leading-snug ${
                  isSolid ? "text-white/75" : "text-(--text-muted)"
                }`}
              >
                {sublabel}
              </p>
            )}
          </div>

          <div
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isSolid
                ? "bg-white/15 text-white"
                : "bg-(--bg-surface) text-(--accent-primary)"
            }`}
          >
            <Icon size={21} strokeWidth={1.75} />
          </div>
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`w-full px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-t transition-colors cursor-pointer ${
              isSolid
                ? "border-white/15 bg-black/15 hover:bg-black/25 text-white"
                : "border-(--border-subtle) bg-(--bg-surface)/60 hover:bg-(--bg-surface) text-(--accent-primary)"
            }`}
          >
            <span>{actionLabel}</span>
            <ArrowRight size={13} strokeWidth={2} />
          </button>
        )}
      </Card>
    </motion.div>
  );
}
