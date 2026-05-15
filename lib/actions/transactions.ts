"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TransactionSchema, UpdateTransactionSchema } from "@/lib/validations";

/**
 * Fetch transactions for a given month with only the fields needed.
 * Accepts optional `limit` to avoid over-fetching (e.g. dashboard only needs 3).
 */
export async function getTransactions(month?: string, limit?: number) {
  const session = await requireAuth();

  const where: Record<string, any> = { tenant_id: session.tenantId };

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    select: {
      id: true,
      amount: true,
      type: true,
      description: true,
      date: true,
      tenant_id: true,
      category_id: true,
      wallet_id: true,
      goal_id: true,
      created_at: true,
      updated_at: true,
      category: {
        select: { id: true, name: true, type: true, svg_code: true },
      },
      wallet: {
        select: { id: true, name: true, type: true, balance: true, tenant_id: true, created_at: true, updated_at: true },
      },
    },
    orderBy: [{ created_at: "desc" }],
    ...(limit ? { take: limit } : {}),
  });

  return transactions.map((t) => ({
    ...t,
    amount: Number(t.amount),
    date: t.date.toISOString(),
    created_at: t.created_at.toISOString(),
    updated_at: t.updated_at.toISOString(),
    wallet: {
      ...t.wallet,
      balance: Number(t.wallet.balance),
      created_at: t.wallet.created_at.toISOString(),
      updated_at: t.wallet.updated_at.toISOString(),
    },
  }));
}

/**
 * Optimized: Use a single groupBy query instead of two separate aggregate queries.
 */
export async function getDashboardStats(month?: string) {
  const session = await requireAuth();
  const where: Record<string, any> = { tenant_id: session.tenantId };

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  // Single query with groupBy instead of 2 separate aggregate queries
  const grouped = await prisma.transaction.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true },
  });

  const totalIncome = Number(
    grouped.find((g) => g.type === "INCOME")?._sum.amount ?? 0
  );
  const totalExpense = Number(
    grouped.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0
  );

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export async function createTransaction(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    walletId: formData.get("walletId"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description") || undefined,
    date: formData.get("date"),
  };

  const parsed = TransactionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { categoryId, walletId, ...data } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          ...data,
          category_id: categoryId,
          wallet_id: walletId,
          date: new Date(parsed.data.date),
          tenant_id: session.tenantId,
        },
      }),
      prisma.wallet.update({
        where: { id: walletId },
        data: {
          balance: {
            [parsed.data.type === "INCOME" ? "increment" : "decrement"]:
              parsed.data.amount,
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Transaction failed:", error);
    return { error: "Gagal menyimpan transaksi" };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTransaction(formData: FormData) {
  const session = await requireAuth();

  const raw = {
    id: formData.get("id"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    walletId: formData.get("walletId"),
    description: formData.get("description") || undefined,
    date: formData.get("date"),
  };

  const parsed = UpdateTransactionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Ensure ownership via tenantId
  const existing = await prisma.transaction.findFirst({
    where: { id: parsed.data.id, tenant_id: session.tenantId },
  });

  if (!existing) return { error: "Transaction not found" };

  const { id, categoryId, walletId, ...data } = parsed.data;

  try {
    await prisma.$transaction([
      // 1. Revert old balance
      prisma.wallet.update({
        where: { id: existing.wallet_id },
        data: {
          balance: {
            [existing.type === "INCOME" ? "decrement" : "increment"]:
              existing.amount,
          },
        },
      }),
      // 2. Update transaction
      prisma.transaction.update({
        where: { id },
        data: {
          ...data,
          ...(categoryId ? { category_id: categoryId } : {}),
          ...(walletId ? { wallet_id: walletId } : {}),
          ...(data.date ? { date: new Date(data.date) } : {}),
        },
      }),
      // 3. Apply new balance
      prisma.wallet.update({
        where: { id: walletId || existing.wallet_id },
        data: {
          balance: {
            [(data.type || existing.type) === "INCOME"
              ? "increment"
              : "decrement"]:
              data.amount !== undefined ? data.amount : existing.amount,
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Update failed:", error);
    return { error: "Gagal memperbarui transaksi" };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const session = await requireAuth();

  const existing = await prisma.transaction.findFirst({
    where: { id, tenant_id: session.tenantId },
  });

  if (!existing) return { error: "Transaction not found" };

  try {
    const operations: any[] = [
      prisma.transaction.delete({ where: { id } }),
      prisma.wallet.update({
        where: { id: existing.wallet_id },
        data: {
          balance: {
            [existing.type === "INCOME" ? "decrement" : "increment"]:
              existing.amount,
          },
        },
      }),
    ];

    if (existing.goal_id) {
      operations.push(
        prisma.financialGoal.update({
          where: { id: existing.goal_id },
          data: {
            current_amount: {
              [existing.type === "INCOME" ? "increment" : "decrement"]:
                existing.amount,
            },
          },
        })
      );
    }

    await prisma.$transaction(operations);
  } catch (error) {
    console.error("Delete failed:", error);
    return { error: "Gagal menghapus transaksi" };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { success: true };
}
