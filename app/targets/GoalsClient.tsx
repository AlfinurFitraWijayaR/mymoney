"use client";

import { useState, useEffect, useMemo } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  createGoal,
  updateGoal,
  updateGoalBalance,
  deleteGoal,
} from "@/lib/actions/goals";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Goal, CATEGORIES } from "@/components/goal/GoalForm";
import {
  GoalInsertModal,
  GoalEditModal,
  GoalUpdateModal,
} from "@/components/goal/GoalModal";

function getCountdown(deadline: string | Date) {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Sudah lewat";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days > 60) {
    const months = Math.ceil(days / 30);
    return `${months} Bulan Lagi`;
  }
  return `${days} Hari Lagi`;
}

function getStatusBadge(goal: Goal) {
  if (goal.status === "COMPLETED")
    return {
      label: "Tercapai",
      color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };

  const WARNING_TOLERANCE = 0.15;
  const now = Date.now();
  const startDate = new Date(goal.created_at).getTime();
  const deadline = new Date(goal.deadline).getTime();
  const totalDuration = deadline - startDate;
  const elapsedDuration = now - startDate;
  const remainingDuration = deadline - now;

  const actualProgress =
    goal.target_amount > 0
      ? Math.min(goal.current_amount / goal.target_amount, 1)
      : 0;

  if (remainingDuration <= 0) {
    return {
      label: "Terlambat",
      color: "bg-red-50 text-red-700 ring-red-200",
    };
  }

  const expectedProgress =
    totalDuration > 0 ? Math.min(elapsedDuration / totalDuration, 1) : 0;

  const isLagging = actualProgress < expectedProgress - WARNING_TOLERANCE;

  if (isLagging) {
    return {
      label: "Tertinggal",
      color: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  }

  return {
    label: "Sesuai Target",
    color: "bg-blue-50 text-blue-700 ring-blue-200",
  };
}

function getProgressColor(goal: Goal) {
  if (goal.status === "COMPLETED") return "bg-emerald-500";
  const progress =
    goal.target_amount > 0 ? goal.current_amount / goal.target_amount : 0;
  if (progress >= 0.7) return "bg-emerald-500";
  if (progress >= 0.4) return "bg-blue-500";
  return "bg-amber-500";
}

export default function GoalsClient({
  goals,
  defaults,
  wallets,
}: {
  goals: Goal[];
  defaults?: Goal;
  wallets?: { id: string; name: string; type?: string; balance: number }[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Goal | null>(null);
  const [balanceTarget, setBalanceTarget] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [walletId, setWalletId] = useState("");
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState(() =>
    defaults?.target_amount ? defaults.target_amount.toString() : "",
  );
  const [balanceAction, setBalanceAction] = useState<"setor" | "tarik" | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayWallets = useMemo(() => {
    return wallets && wallets.length > 0
      ? wallets
      : [
          { id: "default-cash", name: "CASH", balance: 0 },
          { id: "default-ewallet", name: "E-WALLET", balance: 0 },
          { id: "default-bank", name: "BANK", balance: 0 },
        ];
  }, [wallets]);

  useEffect(() => {
    if (displayWallets.length > 0 && !walletId) {
      setWalletId(displayWallets[0].id);
    }
  }, [displayWallets, walletId]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    const amount = (e.currentTarget["target_amount"] as HTMLInputElement).value;
    const cleaned = amount.replace(/\./g, "");

    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("target_amount", cleaned);
    fd.set("icon", selectedCategory.icon);
    const result = await createGoal(fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", "),
      );
      return;
    }
    setCreateOpen(false);
    setSelectedCategory(CATEGORIES[0]);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    const amount = (e.currentTarget["target_amount"] as HTMLInputElement).value;
    const cleaned = amount.replace(/\./g, "");

    e.preventDefault();
    if (!editTarget) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("target_amount", cleaned);
    fd.set("icon", selectedCategory.icon);
    const result = await updateGoal(editTarget.id, fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", "),
      );
      return;
    }
    setEditTarget(null);
  }

  async function handleUpdateBalance(e: React.FormEvent<HTMLFormElement>) {
    const amount = (e.currentTarget["amount"] as HTMLInputElement).value;
    const cleaned = amount.replace(/\./g, "");

    e.preventDefault();
    if (!balanceTarget) return;

    if (balanceAction === "setor") {
      const selectedWal = displayWallets.find((w) => w.id === walletId);
      if (selectedWal && Number(cleaned) > selectedWal.balance) {
        return;
      }
    }

    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", balanceTarget.id);
    fd.set("amount", cleaned);
    if (balanceAction) {
      fd.set("type", balanceAction);
    }
    fd.set("walletId", walletId);
    const result = await updateGoalBalance(fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", "),
      );
      return;
    }
    setBalanceTarget(null);
    setBalanceAction(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteGoal(deleteTarget);
    setLoading(false);
    if (result?.error)
      alert(
        typeof result.error === "string" ? result.error : "Gagal menghapus",
      );
    setDeleteTarget(null);
  }

  const formatDisplay = (val: string) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="section-header relative flex items-center justify-end md:justify-between gap-4">
        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Target Sasaran
          </h1>
        </div>

        {/* Icon btn */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setError(null);
              setSelectedCategory(CATEGORIES[0]);
              setCreateOpen(true);
            }}
            className="text-zinc-600 hover:text-zinc-800 transition-colors"
            id="add-goal-btn"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {goals.length === 0 ? (
        <div className="card p-12 sm:p-16 text-center">
          <div className="flex items-center justify-center mx-auto mb-2">
            <Image src="/yah.svg" alt="Not Found" width={60} height={60} />
          </div>
          <p className="text-surface-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
            Hmph, sepertinya belum ada target keuangan. Yuk, mulai tetapkan
            target keuanganmu! Menabung lebih terarah dengan menetapkan target
            yang jelas dan terukur.
          </p>
        </div>
      ) : (
        /* Goals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map((goal: any) => {
            const progress =
              goal.target_amount > 0
                ? Math.min(
                    (goal.current_amount / goal.target_amount) * 100,
                    100,
                  )
                : 0;
            const badge = getStatusBadge(goal);
            const progressColor = getProgressColor(goal);
            const countdown = getCountdown(goal.deadline);

            return (
              <div
                key={goal.id}
                className={`card p-5 flex flex-col gap-4 transition-shadow hover:shadow-card-hover ${
                  goal.status === "COMPLETED"
                    ? "ring-2 ring-emerald-200 bg-emerald-50/30"
                    : ""
                }`}
                id={`goal-card-${goal.id}`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center flex-shrink-0 shadow-sm text-xl">
                      <Image
                        src={"/" + goal.icon}
                        width={25}
                        height={25}
                        alt={goal.title}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-zinc-800 truncate">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-surface-500 capitalize">
                        {CATEGORIES.find((c) => c.value === goal.category)
                          ?.label || goal.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-zinc-500">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-zinc-700">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-50 rounded-lg p-3">
                    <p className="text-xs text-surface-500 mb-0.5">Terkumpul</p>
                    <p className="text-sm font-bold text-zinc-800">
                      Rp {formatCurrency(goal.current_amount)}
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg p-3">
                    <p className="text-xs text-surface-500 mb-0.5">Target</p>
                    <p className="text-sm font-bold text-zinc-800">
                      Rp {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{countdown}</span>
                  <span className="text-surface-300">•</span>
                  <span>
                    Target:{" "}
                    {new Date(goal.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Button Actions */}
                <div className="flex gap-2 pt-1 border-t border-surface-100">
                  {goal.status !== "COMPLETED" && (
                    <>
                      {/* setor saldo */}
                      <button
                        onClick={() => {
                          setError(null);
                          setBalanceTarget(goal);
                          setBalanceAction("setor");
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                        id={`update-balance-${goal.id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="3" y1="18" x2="21" y2="18"></line>
                          <path d="M17 18v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6"></path>
                          <line x1="10" y1="14" x2="14" y2="14"></line>
                          <line x1="12" y1="2" x2="12" y2="7"></line>
                          <polyline points="9 4 12 7 15 4"></polyline>
                        </svg>
                        Setor
                      </button>

                      {/* tarik saldo */}
                      <button
                        onClick={() => {
                          setError(null);
                          setBalanceTarget(goal);
                          setBalanceAction("tarik");
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                        id={`update-balance-${goal.id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="3" y1="18" x2="21" y2="18"></line>
                          <path d="M17 18v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6"></path>
                          <line x1="10" y1="14" x2="14" y2="14"></line>
                          <line x1="12" y1="8" x2="12" y2="2"></line>
                          <polyline points="9 5 12 2 15 5"></polyline>
                        </svg>
                        Tarik
                      </button>
                    </>
                  )}

                  {/* buton edit */}
                  <button
                    onClick={() => {
                      setError(null);
                      const cat =
                        CATEGORIES.find((c) => c.value === goal.category) ||
                        CATEGORIES[0];
                      setSelectedCategory(cat);
                      setEditTarget(goal);
                    }}
                    className="btn-ghost p-2"
                    title="Edit"
                    id={`edit-goal-${goal.id}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>

                  {/* buton delete */}
                  <button
                    onClick={() => setDeleteTarget(goal.id)}
                    className="btn-ghost p-2 hover:text-red-600 hover:bg-red-50"
                    title="Hapus"
                    id={`delete-goal-${goal.id}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {mounted && (
        <>
          <GoalInsertModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onSubmit={handleCreate}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            loading={loading}
            error={error}
          />

          <GoalEditModal
            open={!!editTarget}
            onClose={() => setEditTarget(null)}
            onSubmit={handleUpdate}
            defaults={editTarget || undefined}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            loading={loading}
            error={error}
          />

          <GoalUpdateModal
            open={!!balanceTarget}
            onClose={() => {
              setBalanceTarget(null);
              setBalanceAction(null);
            }}
            onSubmit={handleUpdateBalance}
            balanceTarget={balanceTarget}
            balanceAction={balanceAction}
            walletId={walletId}
            setWalletId={setWalletId}
            amount={amount}
            handleAmountChange={handleAmountChange}
            formatDisplay={formatDisplay}
            displayWallets={displayWallets}
            loading={loading}
            error={error}
          />

          <ConfirmDialog
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title="Hapus Target"
            message="Apakah Anda yakin ingin menghapus target ini? Tindakan ini tidak dapat dibatalkan."
            loading={loading}
          />
        </>
      )}
    </>
  );
}
