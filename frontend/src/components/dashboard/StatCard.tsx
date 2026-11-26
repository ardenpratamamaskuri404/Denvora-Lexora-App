/**
 * @module components/dashboard/StatCard
 * @description Kartu statistik ringkas bergaya Cream Mocha untuk metrik dashboard perpustakaan.
 */

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  tone?: "default" | "accent" | "danger" | "success";
}

const TONE_MAP = {
  default: "bg-(--bg-surface) text-(--accent-primary)",
  accent: "bg-(--accent-primary) text-[#F6EFE6]",
  danger: "bg-[#9E3B33]/15 text-[#9E3B33] dark:text-[#F39B8F]",
  success: "bg-[#2F6B48]/15 text-[#2F6B48] dark:text-[#9FE0B7]",
};

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-5 shadow-xs transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-(--text-muted)">{label}</p>
          <p className="font-editorial mt-1.5 text-2xl sm:text-3xl font-bold text-(--text-primary) tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_MAP[tone]}`}
        >
          <Icon size={19} strokeWidth={1.75} />
        </div>
      </div>
      {sublabel && <p className="mt-2 text-xs text-(--text-muted)">{sublabel}</p>}
    </div>
  );
}
