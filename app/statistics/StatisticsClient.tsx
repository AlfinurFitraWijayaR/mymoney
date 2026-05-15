"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { getStatistics, type StatisticsData } from "@/lib/actions/statistics";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

// Lazy-load heavy chart components to reduce initial bundle size
const LazyBarChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.BarChart })),
  { ssr: false }
);
const LazyBar = dynamic(
  () => import("recharts").then((m) => ({ default: m.Bar })),
  { ssr: false }
);
const LazyXAxis = dynamic(
  () => import("recharts").then((m) => ({ default: m.XAxis })),
  { ssr: false }
);
const LazyYAxis = dynamic(
  () => import("recharts").then((m) => ({ default: m.YAxis })),
  { ssr: false }
);
const LazyCartesianGrid = dynamic(
  () => import("recharts").then((m) => ({ default: m.CartesianGrid })),
  { ssr: false }
);
const LazyTooltip = dynamic(
  () => import("recharts").then((m) => ({ default: m.Tooltip })),
  { ssr: false }
);
const LazyLegend = dynamic(
  () => import("recharts").then((m) => ({ default: m.Legend })),
  { ssr: false }
);
const LazyResponsiveContainer = dynamic(
  () => import("recharts").then((m) => ({ default: m.ResponsiveContainer })),
  { ssr: false }
);
const LazyPieChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.PieChart })),
  { ssr: false }
);
const LazyPie = dynamic(
  () => import("recharts").then((m) => ({ default: m.Pie })),
  { ssr: false }
);
const LazyCell = dynamic(
  () => import("recharts").then((m) => ({ default: m.Cell })),
  { ssr: false }
);
const LazyAreaChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.AreaChart })),
  { ssr: false }
);
const LazyArea = dynamic(
  () => import("recharts").then((m) => ({ default: m.Area })),
  { ssr: false }
);


const INCOME_COLOR = "#10b981"; // emerald-500
const EXPENSE_COLOR = "#f43f5e"; // rose-500
const AREA_COLOR = "#3b82f6"; // blue-500

const DONUT_COLORS = [
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#64748b",
];

// ── Custom tooltip ─────────────────────────────────────────
function CurrencyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-surface-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-zinc-800 mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-zinc-500">{p.name}:</span>
          <span className="font-bold text-zinc-800">
            Rp {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-100 rounded-xl ${className}`} />
  );
}

function ChartSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-5 w-40 mb-6" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ChartSkeleton2() {
  return (
    <div className="bg-white/90 py-2 w-[330px] md:w-[510px] mx-auto rounded-2xl mb-6">
      <Skeleton className="h-5 w-40 mb-4 mx-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function StatisticsClient() {
  const [mode, setMode] = useState<"monthly" | "yearly">("yearly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getStatistics(
        currentDate.getFullYear(),
        mode === "monthly" ? currentDate.getMonth() + 1 : undefined,
      );
      setData(result);
    } catch (e) {
      console.error("Failed to load statistics", e);
    } finally {
      setLoading(false);
    }
  }, [currentDate, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (mode === "monthly") newDate.setMonth(newDate.getMonth() - 1);
    else if (mode === "yearly") newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (mode === "monthly") newDate.setMonth(newDate.getMonth() + 1);
    else if (mode === "yearly") newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const formatDisplayDate = () => {
    if (mode === "monthly") {
      return currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    } else if (mode === "yearly") {
      return currentDate.getFullYear().toString();
    }
    return "";
  };

  const hasData =
    data &&
    (data.cashFlow.some((d) => d.income > 0 || d.expense > 0) ||
      data.categorySpending.length > 0);

  return (
    <>
      <div className="bg-primary-600 text-white pt-4 pb-16 px-6 rounded-b-[1.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-primary-700/30 rounded-full blur-2xl"></div>
        {/* Header */}
        <div className="flex flex-col gap-8 mb-2 relative z-10">
          {/* ── Title & Filters */}
          <div className="flex items-center justify-between w-full mt-2">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Statistik</h1>
              <p className="text-zinc-100 text-sm">
                Ringkasan informasi statistik
              </p>
            </div>

            {/* Icon Filter */}
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400 relative">
              <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-primary-500"
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "monthly" | "yearly")
                }
              >
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 16h8"></path>
                <path d="M14 14l2 2-2 2"></path>
              </svg>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center justify-between w-full">
            {/* Previous */}
            <button
              onClick={handlePrev}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-zinc-100">
              {formatDisplayDate()}
            </span>
            {/* Next */}
            <button
              onClick={handleNext}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary cards ────────────────────────────── */}
      {loading ? (
        <div className="-mt-10 relative z-20">
          <ChartSkeleton2 />
        </div>
      ) : (
        <div className="px-6 md:px-96 -mt-10 relative z-20 mb-6">
          {/* Summary Cards */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
            <h3 className=" text-zinc-800 font-medium tracking-tight mb-2">
              Ringkasan
            </h3>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-600">Penghasilan</p>
              <p className="text-sm font-semibold text-emerald-600">
                Rp. {formatCurrency(data?.summary.totalIncome || 0)}
              </p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-600">Pengeluaran</p>
              <p className="text-sm font-semibold text-rose-500">
                Rp. {formatCurrency(data?.summary.totalExpense || 0)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600">Pendapatan Bersih</p>
              <p className="text-sm font-semibold text-zinc-800">
                Rp. {formatCurrency(data?.summary.netSavings || 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading state ────────────────────────────────── */}
      {loading ? (
        <div className="space-y-6 px-6">
          <ChartSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      ) : !hasData ? (
        /* ── Empty state ──────────────────────────────────── */
        <div className="px-6">
          <div className="card p-12 sm:p-16 text-center">
            <div className="flex items-center justify-center mx-auto mb-2">
              <Image src="/yah.svg" alt="Not Found" width={60} height={60} />
            </div>
            <p className="text-surface-500 text-sm max-w-sm mx-auto leading-relaxed">
              Yahh, belum ada data
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Cash Flow chart ──────────────────────────── */}
          <div className="px-6 mb-6">
            <div className="card p-5 sm:p-6" id="chart-cashflow">
              <h2 className="text-sm font-semibold text-zinc-800 mb-5">
                Arus Kas {mode === "monthly" ? "Bulanan" : "Tahunan"}
              </h2>
              <div className="h-72 sm:h-80">
                <LazyResponsiveContainer width="100%" height="100%">
                  <LazyBarChart data={data!.cashFlow} barCategoryGap="20%">
                    <LazyCartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e4ece8"
                      vertical={false}
                    />
                    <LazyXAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6e8f85", fontSize: 11 }}
                    />
                    <LazyYAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6e8f85", fontSize: 11 }}
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(1)}jt`
                          : v >= 1000
                            ? `${(v / 1000).toFixed(0)}rb`
                            : String(v)
                      }
                      width={50}
                    />
                    <LazyTooltip content={<CurrencyTooltip />} />
                    <LazyLegend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    />
                    <LazyBar
                      dataKey="income"
                      name="Pemasukan"
                      fill={INCOME_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                    <LazyBar
                      dataKey="expense"
                      name="Pengeluaran"
                      fill={EXPENSE_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </LazyBarChart>
                </LazyResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Secondary charts grid ────────────────────── */}
          <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Donut — Category Spending */}
            <div className="card p-5 sm:p-6" id="chart-category">
              <h2 className="text-sm font-semibold text-zinc-800 mb-5">
                Pengeluaran per Kategori
              </h2>
              {data!.categorySpending.length === 0 ? (
                <p className="text-surface-400 text-sm text-center py-12">
                  Tidak ada data pengeluaran
                </p>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-48 h-48 flex-shrink-0 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-zinc-400 font-medium leading-none mb-1">
                        Total
                      </span>
                      <span className="text-xs font-bold text-zinc-800 px-4 text-center break-all">
                        Rp {formatCurrency(data!.summary.totalExpense)}
                      </span>
                    </div>
                    <LazyResponsiveContainer width="100%" height="100%">
                      <LazyPieChart>
                        <LazyPie
                          data={data!.categorySpending}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          dataKey="amount"
                          nameKey="name"
                          paddingAngle={2}
                          strokeWidth={0}
                        >
                          {data!.categorySpending.map((_, i) => (
                            <LazyCell
                              key={i}
                              fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                            />
                          ))}
                        </LazyPie>
                        <LazyTooltip
                          formatter={(value: any) => [
                            `Rp ${formatCurrency(Number(value) || 0)}`,
                            "",
                          ]}
                          contentStyle={{
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid #e4ece8",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                      </LazyPieChart>
                    </LazyResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-2 w-full">
                    {data!.categorySpending
                      .slice(0, 8)
                      .map((cat: any, i: any) => (
                        <div
                          key={cat.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                background:
                                  DONUT_COLORS[i % DONUT_COLORS.length],
                              }}
                            />
                            <span className="text-zinc-600 truncate">
                              {cat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-bold text-zinc-800">
                              {cat.percentage}%
                            </span>
                            <span className="text-zinc-400 text-[10px] hidden sm:inline">
                              Rp {formatCurrency(cat.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Area — Cumulative Balance */}
            <div className="card p-5 sm:p-6" id="chart-balance">
              <h2 className="text-sm font-semibold text-zinc-800 mb-5">
                Tren Saldo Kumulatif
              </h2>
              {data!.cumulativeBalance.length === 0 ? (
                <p className="text-surface-400 text-sm text-center py-12">
                  Tidak ada data saldo
                </p>
              ) : (
                <div className="h-48">
                  <LazyResponsiveContainer width="100%" height="100%">
                    <LazyAreaChart data={data!.cumulativeBalance}>
                      <defs>
                        <linearGradient
                          id="balanceGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={AREA_COLOR}
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor={AREA_COLOR}
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <LazyCartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e4ece8"
                        vertical={false}
                      />
                      <LazyXAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6e8f85", fontSize: 10 }}
                      />
                      <LazyYAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6e8f85", fontSize: 10 }}
                        tickFormatter={(v) =>
                          v >= 1_000_000
                            ? `${(v / 1_000_000).toFixed(1)}jt`
                            : v >= 1000
                              ? `${(v / 1000).toFixed(0)}rb`
                              : String(v)
                        }
                        width={45}
                      />
                      <LazyTooltip content={<CurrencyTooltip />} />
                      <LazyArea
                        type="monotone"
                        dataKey="balance"
                        name="Saldo"
                        stroke={AREA_COLOR}
                        strokeWidth={2.5}
                        fill="url(#balanceGrad)"
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                      />
                    </LazyAreaChart>
                  </LazyResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
