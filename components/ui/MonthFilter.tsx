"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, getMonthLabel } from "@/lib/utils";

interface MonthFilterProps {
  value?: string;
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function MonthFilter({ value }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState(
    value && value !== "all"
      ? parseInt(value.split("-")[0])
      : new Date().getFullYear(),
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMonthSelect(monthIndex: number) {
    const monthStr = String(monthIndex + 1).padStart(2, "0");
    const newValue = `${selectedYear}-${monthStr}`;

    const params = new URLSearchParams(searchParams.toString());
    params.set("month", newValue);
    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  function handleAllTime() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("month");
    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  const currentLabel =
    value && value !== "all" ? getMonthLabel(value) : "Semua Waktu";

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm">
        <svg
          className="w-6 h-6 text-zinc-600"
          xmlns="http://www.w3.org/2000/svg "
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="8" x2="13" y2="8"></line>
          <circle cx="16" cy="8" r="3"></circle>
          <line x1="19" y1="8" x2="20" y2="8"></line>

          <line x1="4" y1="16" x2="5" y2="16"></line>
          <circle cx="8" cy="16" r="3"></circle>
          <line x1="11" y1="16" x2="20" y2="16"></line>
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="fixed inset-0" onClick={() => setOpen(false)} />

            <div
              className={cn(
                "bg-white w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out relative z-10",
                open ? "translate-y-0" : "translate-y-full",
              )}
            >
              {/* Header Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-surface-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-surface-100">
                <h2 className="text-lg font-bold text-zinc-800">
                  Filter Waktu
                </h2>
                <button
                  onClick={handleAllTime}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Semua Waktu
                </button>
              </div>

              {/* Year Selector */}
              <div className="px-6 py-6 flex items-center justify-between">
                <button
                  onClick={() => setSelectedYear((y) => y - 1)}
                  className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 text-zinc-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <div className="text-2xl font-black text-zinc-900 tracking-tight">
                  {selectedYear}
                </div>

                <button
                  onClick={() => setSelectedYear((y) => y + 1)}
                  className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 text-zinc-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              {/* Month Grid */}
              <div className="px-6 pb-10">
                <div className="grid grid-cols-3 gap-3">
                  {MONTHS.map((monthName, index) => {
                    const monthValue = `${selectedYear}-${String(index + 1).padStart(2, "0")}`;
                    const isSelected = value === monthValue;
                    const isCurrentMonth =
                      new Date().getMonth() === index &&
                      new Date().getFullYear() === selectedYear;

                    return (
                      <button
                        key={monthName}
                        onClick={() => handleMonthSelect(index)}
                        className={cn(
                          "py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 border",
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-surface-50 border-surface-100 text-zinc-600 hover:bg-surface-100",
                          isCurrentMonth &&
                            !isSelected &&
                            "border-blue-200 text-blue-600",
                        )}
                      >
                        {monthName.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
