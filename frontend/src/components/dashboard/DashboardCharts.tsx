/**
 * @module components/dashboard/DashboardCharts
 * @description Grafik area tren peminjaman 7 hari terakhir dan diagram donat kategori (SVG offline lokal).
 */

"use client";

import { useState } from "react";
import { PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryStatItem, DailyBorrowPoint } from "@/types/library";

interface DashboardChartsProps {
  trendPoints: DailyBorrowPoint[];
  categories: CategoryStatItem[];
  trendTitle?: string;
}

const DONUT_COLORS = ["#A8643A", "#2B1D14", "#2F6B48", "#C87E4F", "#8C7B6B"];
const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatShortDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const mIdx = Number(parts[1]) - 1;
  return `${Number(parts[2])} ${MONTHS_ID[mIdx] || parts[1]}`;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function DashboardCharts({
  trendPoints,
  categories,
  trendTitle = "Statistik Peminjaman (7 Hari Terakhir)",
}: DashboardChartsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const w = 520;
  const h = 195;
  const padL = 32;
  const padR = 18;
  const padT = 18;
  const padB = 34;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const maxVal = Math.max(2, ...trendPoints.map((p) => p.count));

  const coords = trendPoints.map((pt, idx) => {
    const x =
      trendPoints.length > 1
        ? padL + (idx / (trendPoints.length - 1)) * innerW
        : padL + innerW / 2;
    const y = padT + innerH - (pt.count / maxVal) * innerH;
    return { ...pt, x, y };
  });

  const linePath = buildSmoothPath(coords);
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${padT + innerH} L ${coords[0].x} ${padT + innerH} Z`
      : "";

  const totalTitles = categories.reduce((sum, c) => sum + c.titles_count, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = categories.reduce<
    Array<CategoryStatItem & { color: string; dashArray: string; dashOffset: number }>
  >((acc, cat, idx) => {
    const prevRatio = acc.reduce(
      (s, item) => s + (totalTitles > 0 ? item.titles_count / totalTitles : 0),
      0
    );
    const ratio = totalTitles > 0 ? cat.titles_count / totalTitles : 0;
    const len = ratio * circumference;
    acc.push({
      ...cat,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
      dashArray: `${len} ${circumference - len}`,
      dashOffset: -prevRatio * circumference,
    });
    return acc;
  }, []);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Card className="lg:col-span-7">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={17} className="text-(--accent-primary)" />
                <span>{trendTitle}</span>
              </CardTitle>
              <CardDescription>
                Aktivitas peminjaman harian berdasarkan catatan transaksi real-time.
              </CardDescription>
            </div>
            {hoveredIdx !== null && coords[hoveredIdx] && (
              <span className="rounded-full bg-(--bg-surface) px-3 py-1 text-xs font-semibold text-(--text-primary) tabular-nums">
                {formatShortDate(coords[hoveredIdx].date)}: {coords[hoveredIdx].count} pinjam
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible" role="img">
            <defs>
              <linearGradient id="denvoraTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A8643A" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#A8643A" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[0, 0.5, 1].map((step) => {
              const y = padT + innerH * (1 - step);
              const val = Math.round(maxVal * step);
              return (
                <g key={step}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={w - padR}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={padL - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="currentColor"
                    opacity="0.55"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {areaPath && <path d={areaPath} fill="url(#denvoraTrendFill)" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#A8643A"
                strokeWidth="2.75"
                strokeLinecap="round"
              />
            )}

            {coords.map((pt, idx) => (
              <g
                key={pt.date}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === idx ? 5.5 : 4}
                  fill="#FBF7F1"
                  stroke="#A8643A"
                  strokeWidth="2.5"
                />
                <text
                  x={pt.x}
                  y={h - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.65"
                >
                  {formatShortDate(pt.date)}
                </text>
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart size={17} className="text-(--accent-primary)" />
            <span>Kategori Koleksi</span>
          </CardTitle>
          <CardDescription>
            Proporsi judul buku di seluruh rak kategori perpustakaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-5 pt-2">
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="22"
              />
              {donutSegments.map((seg) => (
                <circle
                  key={seg.category_name}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="22"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-editorial text-xl font-bold text-(--text-primary) tabular-nums">
                {totalTitles}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-(--text-muted)">
                Judul
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2 text-xs">
            {donutSegments.map((seg) => (
              <li key={seg.category_name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0 text-(--text-primary)">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="truncate">{seg.category_name}</span>
                </span>
                <span className="shrink-0 font-semibold text-(--text-muted) tabular-nums">
                  {seg.titles_count} judul
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
