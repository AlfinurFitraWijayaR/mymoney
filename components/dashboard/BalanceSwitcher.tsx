"use client";

import { useState, useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { WalletType } from "@prisma/client";
import Image from "next/image";

interface Wallet {
  id: string;
  type: WalletType;
  name: string;
  balance: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

interface BalanceSwitcherProps {
  monthlyStats: Stats;
  overallStats: Stats;
  monthLabel: string;
  wallets: Wallet[] | null;
}

export function BalanceSwitcher({
  monthlyStats,
  overallStats,
  monthLabel,
  wallets,
}: BalanceSwitcherProps) {
  const [mode, setMode] = useState<"month" | "overall">("month");
  const stats = mode === "month" ? monthlyStats : overallStats;

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && mode === "month") {
      setMode("overall");
    } else if (isRightSwipe && mode === "overall") {
      setMode("month");
    }
  };

  const totalWalletBalance =
    wallets?.reduce((acc, wallet) => acc + Number(wallet.balance), 0) || 0;

  const displayWallets =
    wallets && wallets.length > 0
      ? wallets
      : [
          { id: "default-cash", name: "CASH", balance: 0 },
          { id: "default-ewallet", name: "E-WALLET", balance: 0 },
          { id: "default-bank", name: "BANK", balance: 0 },
        ];

  return (
    <div
      className="relative z-10 select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Switcher Toggle */}
      <div className="relative inline-flex items-center p-1 mb-8 overflow-hidden group">
        {/* Sliding Background */}
        <div
          className={`absolute inset-y-1 rounded-full bg-white/85 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
          style={{
            left: mode === "month" ? "4px" : "50%",
            width: "calc(50% - 4px)",
          }}
        />

        <button
          onClick={() => setMode("month")}
          className={`relative z-10 px-6 py-2 text-xs font-bold transition-colors duration-300 whitespace-nowrap ${
            mode === "month"
              ? "text-primary-600"
              : "text-primary-100/80 hover:text-white/35"
          }`}
        >
          {monthLabel}
        </button>

        <button
          onClick={() => setMode("overall")}
          className={`relative z-10 px-6 py-2 text-xs font-bold transition-colors duration-300 whitespace-nowrap ${
            mode === "overall"
              ? "text-primary-600"
              : "text-primary-100/80 hover:text-white/35"
          }`}
        >
          Total Saldo
        </button>
      </div>

      {/* Balance Content with Transition */}
      <div className="relative min-h-[80px]">
        {/* Saldo Bulan Ini */}
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
            mode === "month"
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0 pointer-events-none absolute inset-0"
          }`}
        >
          {/* Header Saldo Bulan Ini */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-primary-100/80 text-[10px] uppercase tracking-[0.2em] font-black">
              Sisa Keuangan Bulan Ini
            </p>
          </div>

          {/* Saldo Bulan Ini */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black drop-shadow-sm flex items-center justify-between gap-2">
              <span className="text-sm text-white/80">Rp</span>{" "}
              {formatCurrency(monthlyStats.balance)}
            </h2>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-4 sm:mt-14 mt-16">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg flex items-center gap-3 group/stat">
              <div className="bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover/stat:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="7" x2="17" y2="17"></line>
                  <polyline points="17 9 17 17 9 17"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider">
                  Pemasukan
                </p>
                <p className="text-[10px] md:text-sm font-black tabular-nums text-white truncate w-full">
                  <span className="text-[8px] md:text-xs font-normal mr-0.5 text-white/75">
                    Rp{" "}
                  </span>
                  {formatCurrency(Number(stats.totalIncome))
                    .replace("Rp", "")
                    .trim()}
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg flex items-center gap-3 group/stat">
              <div className="bg-rose-500 text-white p-2.5 rounded-2xl shadow-lg shadow-rose-500/30 group-hover/stat:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="9 7 17 7 17 15"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider">
                  Pengeluaran
                </p>
                <p className="text-[10px] md:text-sm font-black tabular-nums text-white truncate w-full">
                  <span className="text-[8px] md:text-xs font-normal mr-0.5 text-white/75">
                    Rp{" "}
                  </span>
                  {formatCurrency(Number(stats.totalExpense))
                    .replace("Rp", "")
                    .trim()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Saldo */}
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
            mode === "overall"
              ? "translate-x-0 opacity-100"
              : "translate-x-4 opacity-0 pointer-events-none absolute inset-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-primary-100/80 text-[10px] uppercase tracking-[0.2em] font-black">
              Total Saldo Keseluruhan
            </p>
          </div>
          {/* Content Saldo */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black drop-shadow-sm flex items-center justify-between gap-2">
              <span className="text-sm text-white/80">Rp</span>{" "}
              {formatCurrency(totalWalletBalance)}
            </h2>
          </div>

          {/* List Akun */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-14">
            {displayWallets.map((wallet) => (
              <div key={wallet.id} className="min-w-0">
                <div className="bg-white/10 backdrop-blur-md p-2.5 md:p-4 rounded-2xl md:rounded-3xl border border-white/20 shadow-lg flex flex-col md:flex-row items-center gap-1.5 md:gap-3 group/stat h-full transition-all active:scale-95">
                  <div className="flex-shrink-0">
                    <Image
                      src={`/wallet/${wallet.name.toLowerCase()}.svg`}
                      width={24}
                      height={24}
                      className="md:w-8 md:h-8"
                      alt={wallet.name.toLowerCase()}
                    />
                  </div>
                  <div className="flex flex-col text-white/75 items-center md:items-start min-w-0 w-full text-center md:text-left">
                    <span className="text-[8.5px] md:text-[10px] font-bold uppercase tracking-wider truncate w-full">
                      {wallet.name}
                    </span>
                    <p className="text-[10px] md:text-sm font-black tabular-nums text-white truncate w-full">
                      <span className="text-[8px] md:text-xs font-normal mr-0.5 text-white/75">
                        Rp{" "}
                      </span>
                      {formatCurrency(Number(wallet.balance))
                        .replace("Rp", "")
                        .trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
