/**
 * @module components/dashboard/DashboardCharts
 * @description Grafik interaktif Recharts (AreaChart & Donut PieChart) lengkap dengan animasi gerak & tooltip real-time.
 */

"use client";

import { motion } from "motion/react";
import { PieChart as PieIcon, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryStatItem, DailyBorrowPoint } from "@/types/library";

interface DashboardChartsProps {
  trendPoints: DailyBorrowPoint[];
  categories: CategoryStatItem[];
  trendTitle?: string;
}

const DONUT_COLORS = ["#A8643A", "#3B2518", "#2F6B48", "#C87E4F", "#8C7B6B"];
const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatShortDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${Number(parts[2])} ${MONTHS_ID[Number(parts[1]) - 1] || parts[1]}`;
}

export function DashboardCharts({
  trendPoints,
  categories,
  trendTitle = "Statistik Peminjaman (7 Hari Terakhir)",
}: DashboardChartsProps) {
  const areaData = trendPoints.map((p) => ({
    label: formatShortDate(p.date),
    date: p.date,
    count: p.count,
  }));

  const pieData = categories.map((c, idx) => ({
    name: c.category_name,
    value: c.titles_count,
    copies: c.copies_total,
    color: DONUT_COLORS[idx % DONUT_COLORS.length],
  }));

  const totalTitles = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={17} className="text-(--accent-primary)" />
              <span>{trendTitle}</span>
            </CardTitle>
            <CardDescription>
              Aktivitas peminjaman harian berdasarkan catatan transaksi real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 8, right: 14, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="denvoraAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C87E4F" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="#A8643A" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="var(--border-subtle)" opacity={0.65} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--surface-elevated)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val ?? 0} peminjaman`, "Total"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#A8643A"
                  strokeWidth={2.75}
                  fill="url(#denvoraAreaGradient)"
                  animationDuration={950}
                  activeDot={{ r: 6, fill: "#C87E4F", stroke: "#FBF7F1", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon size={17} className="text-(--accent-primary)" />
              <span>Kategori Koleksi</span>
            </CardTitle>
            <CardDescription>
              Proporsi judul buku di seluruh rak kategori perpustakaan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {totalTitles === 0 ? (
              <p className="py-12 text-center text-xs text-(--text-muted)">
                Belum ada data kategori koleksi.
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-[180px] w-[180px] shrink-0">
                  <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
                    <span className="font-editorial text-xl font-bold text-(--text-primary)">
                      {totalTitles}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-(--text-muted)">
                      Judul
                    </span>
                  </div>
                  <div className="relative z-10 h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          animationDuration={900}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          wrapperStyle={{ zIndex: 40 }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--surface-elevated)",
                            color: "var(--text-primary)",
                            fontSize: "12px",
                            boxShadow: "0 10px 25px rgba(43,29,20,0.16)",
                          }}
                          formatter={(val) => [`${val ?? 0} judul`, "Koleksi"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <ul className="flex-1 w-full space-y-2 text-xs">
                  {pieData.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate text-(--text-primary) font-medium">
                          {item.name}
                        </span>
                      </span>
                      <span className="tabular-nums text-(--text-muted) shrink-0">
                        {item.value} judul
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
