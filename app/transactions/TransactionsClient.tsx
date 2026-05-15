"use client";
import { Suspense, useState, useEffect, useTransition, useCallback } from "react";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/actions/transactions";
import { formatCurrency } from "@/lib/utils";
import MonthFilter from "@/components/ui/MonthFilter";
import { WalletType } from "@prisma/client";
import Image from "next/image";
import {
  TransactionCreateModal,
  TransactionDeleteModal,
  TransactionEditModal,
} from "@/components/transaction/TransactionModal";

interface Wallet {
  id: string;
  type: WalletType;
  name: string;
  balance: number;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  svg_code?: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  createdAt: string;
  category: Category;
  categoryId: string;
  wallet: Wallet;
}

interface Props {
  transactions: Transaction[];
  categories: Category[];
  wallets: any[];
  month: string;
}

const emptyForm = {
  amount: "",
  type: "INCOME" as "INCOME" | "EXPENSE",
  categoryId: "",
  walletId: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionsClient({
  transactions,
  categories,
  wallets,
  month,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Optimistic state for immediate UI feedback
  const [optimisticTxs, setOptimisticTxs] = useState(transactions);

  // Sync with server data when it changes
  useEffect(() => {
    setOptimisticTxs(transactions);
  }, [transactions]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function openCreate() {
    setForm({
      ...emptyForm,
      categoryId: categories.find((c) => c.type === "INCOME")?.id ?? "",
      walletId: wallets[0]?.id ?? "",
    });
    setError(null);
    setCreateOpen(true);
  }

  function openEdit(tx: Transaction) {
    setForm({
      amount: String(tx.amount),
      type: tx.type,
      categoryId: tx.categoryId,
      walletId: tx.wallet.id,
      description: tx.description ?? "",
      date: tx.date.split("T")[0],
    });
    setError(null);
    setEditTarget(tx);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);

    // Close modal immediately for perceived speed
    setCreateOpen(false);

    startTransition(async () => {
      const result = await createTransaction(fd);
      setLoading(false);
      if (result?.error) {
        setError(
          typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error),
        );
        setCreateOpen(true); // Re-open on error
      }
    });
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTarget) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", editTarget.id);

    // Close modal immediately
    const target = editTarget;
    setEditTarget(null);

    startTransition(async () => {
      const result = await updateTransaction(fd);
      setLoading(false);
      if (result?.error) {
        setError(
          typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error),
        );
        setEditTarget(target); // Re-open on error
      }
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);

    // Optimistic removal from list
    const deletedId = deleteTarget;
    setOptimisticTxs((prev) => prev.filter((tx) => tx.id !== deletedId));
    setDeleteTarget(null);
    setEditTarget(null);

    startTransition(async () => {
      const result = await deleteTransaction(deletedId);
      setLoading(false);
      if (result?.error) {
        // Revert optimistic delete on error
        setOptimisticTxs(transactions);
      }
    });
  }

  const groupedTransactions = optimisticTxs.reduce(
    (acc, tx) => {
      const dateObj = new Date(tx.date);
      const dateStr = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj);

      if (!acc[dateStr]) {
        acc[dateStr] = { transactions: [], total: 0 };
      }
      acc[dateStr].transactions.push(tx);
      acc[dateStr].total +=
        tx.type === "INCOME" ? Number(tx.amount) : -Number(tx.amount);
      return acc;
    },
    {} as Record<string, { transactions: Transaction[]; total: number }>,
  );

  const filteredCategories = categories.filter(
    (cat) => cat.name !== "Target Keuangan" && cat.name !== "Target Sasaran",
  );

  return (
    <>
      {/* Header */}
      <div className="section-header relative flex items-center justify-end md:justify-between gap-4 mb-6">
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Transaksi
          </h1>
        </div>

        {/* icon */}
        <div className="flex items-center gap-2">
          <Suspense>
            <MonthFilter value={month} />
          </Suspense>

          <button
            onClick={openCreate}
            className="hidden md:block p-1 text-zinc-600 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
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

      {/* Pending indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-blue-500/20">
          <div className="h-full bg-blue-500 animate-pulse w-full" />
        </div>
      )}

      {/* Table Main */}
      {optimisticTxs.length === 0 ? (
        <div className="card p-12 sm:p-16 text-center mt-6">
          <div className="flex items-center justify-center mx-auto mb-2">
            <Image src="/yah.svg" alt="Not Found" width={60} height={60} />
          </div>
          <p className="text-zinc-500 mb-1">Hmph, belum ada transaksi</p>
        </div>
      ) : (
        <div className="mt-6 -mx-4 md:mx-0">
          {Object.entries(groupedTransactions).map(([dateLabel, group]) => (
            <div key={dateLabel} className="mb-3">
              {/* Date Header */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 w-full">
                <p className="text-zinc-500 text-[13px]">{dateLabel}</p>
                <p
                  className={`text-[13px] ${group.total >= 0 ? "text-zinc-500" : "text-zinc-500"}`}
                >
                  {group.total >= 0 ? "+ Rp" : "- Rp"}
                  {formatCurrency(Math.abs(group.total))}
                </p>
              </div>

              {/* Transactions in this date */}
              <div className="space-y-3 px-3 mt-3">
                {group.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => openEdit(tx)}
                    className={`bg-white rounded-xl p-4 flex items-center justify-between border border-zinc-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform ${
                      tx.category.name === "Target Keuangan" ||
                      tx.category.name === "Target Sasaran"
                        ? "opacity-80"
                        : ""
                    }`}
                  >
                    {/* Icon & Deskripsi */}
                    <div className="flex items-center gap-4">
                      {/* icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        dangerouslySetInnerHTML={{
                          __html: tx.category.svg_code ?? "",
                        }}
                      />
                      {/* deskripsi */}
                      <div>
                        <p className="font-semibold text-zinc-700 text-sm">
                          {tx.category.name}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          {tx.type === "INCOME"
                            ? `Pemasukan ke ${tx.wallet.name}`
                            : `Pengeluaran dari ${tx.wallet.name}`}
                        </p>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          {tx.description || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Jumlah */}
                    <div className="text-right">
                      <p
                        className={`font-semibold text-[14px] ${
                          tx.type === "INCOME"
                            ? "text-emerald-600"
                            : "text-[#c2410c]"
                        }`}
                      >
                        {tx.type === "INCOME" ? "Rp" : "- Rp"}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {mounted && (
        <>
          <TransactionCreateModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            form={form}
            setForm={setForm}
            categories={filteredCategories}
            wallets={wallets}
            onSubmit={handleCreate}
            loading={loading}
            error={error}
          />
          <TransactionEditModal
            open={!!editTarget}
            onClose={() => setEditTarget(null)}
            editTarget={editTarget}
            form={form}
            setForm={setForm}
            categories={filteredCategories}
            wallets={wallets}
            onSubmit={handleUpdate}
            onDeleteClick={() => setDeleteTarget(editTarget!.id)}
            loading={loading}
            error={error}
          />
          <TransactionDeleteModal
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={loading}
          />
        </>
      )}
    </>
  );
}
