"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export interface MonthlyCashFlow {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySpending {
  name: string;
  amount: number;
  percentage: number;
}

export interface CumulativeBalance {
  date: string;
  balance: number;
}

export interface StatsSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
}

export interface StatisticsData {
  summary: StatsSummary;
  cashFlow: MonthlyCashFlow[];
  categorySpending: CategorySpending[];
  cumulativeBalance: CumulativeBalance[];
}

export async function getStatistics(
  year?: number,
  month?: number,
): Promise<StatisticsData> {
  const session = await requireAuth();
  const tenantId = session.tenantId;
  const targetYear = year ?? new Date().getFullYear();

  let dateStart: Date;
  let dateEnd: Date;

  if (month) {
    // Single month view
    dateStart = new Date(targetYear, month - 1, 1);
    dateEnd = new Date(targetYear, month, 0, 23, 59, 59);
  } else {
    // Yearly view
    dateStart = new Date(targetYear, 0, 1);
    dateEnd = new Date(targetYear, 11, 31, 23, 59, 59);
  }

  const where = {
    tenant_id: tenantId,
    date: { gte: dateStart, lte: dateEnd },
  };

  // ── Summary: aggregate totals ──────────────────────────────
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpense = Number(expenseAgg._sum.amount ?? 0);

  const summary: StatsSummary = {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
  };

  // ── Cash Flow: group by month ──────────────────────────────
  const transactions = await prisma.transaction.findMany({
    where,
    select: { amount: true, type: true, date: true },
    orderBy: { date: "asc" },
  });

  const cashFlowMap = new Map<string, { income: number; expense: number }>();

  if (month) {
    // Group by day for single-month view
    const daysInMonth = new Date(targetYear, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = String(d).padStart(2, "0");
      cashFlowMap.set(key, { income: 0, expense: 0 });
    }
    for (const tx of transactions) {
      const day = String(new Date(tx.date).getDate()).padStart(2, "0");
      const entry = cashFlowMap.get(day)!;
      if (tx.type === "INCOME") entry.income += tx.amount;
      else entry.expense += tx.amount;
    }
  } else {
    // Group by month for yearly view
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    for (let m = 0; m < 12; m++) {
      cashFlowMap.set(monthNames[m], { income: 0, expense: 0 });
    }
    for (const tx of transactions) {
      const m = new Date(tx.date).getMonth();
      const key = monthNames[m];
      const entry = cashFlowMap.get(key)!;
      if (tx.type === "INCOME") entry.income += tx.amount;
      else entry.expense += tx.amount;
    }
  }

  const cashFlow: MonthlyCashFlow[] = Array.from(cashFlowMap.entries()).map(
    ([month, data]) => ({ month, income: data.income, expense: data.expense }),
  );

  // ── Category Spending: group expenses by category ──────────
  const expensesByCategory = await prisma.transaction.findMany({
    where: { ...where, type: "EXPENSE" },
    select: { amount: true, category: { select: { name: true } } },
  });

  const catMap = new Map<string, number>();
  for (const tx of expensesByCategory) {
    const name = tx.category.name;
    catMap.set(name, (catMap.get(name) ?? 0) + tx.amount);
  }

  const totalCatSpending = Array.from(catMap.values()).reduce(
    (s, v) => s + v,
    0,
  );

  const categorySpending: CategorySpending[] = Array.from(catMap.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      percentage:
        totalCatSpending > 0
          ? Math.round((amount / totalCatSpending) * 100)
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // ── Cumulative Balance: running total over time ────────────
  const allTxSorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let runningBalance = 0;
  const balanceMap = new Map<string, number>();

  for (const tx of allTxSorted) {
    const dateKey = new Date(tx.date).toISOString().split("T")[0];
    if (tx.type === "INCOME") runningBalance += tx.amount;
    else runningBalance -= tx.amount;
    balanceMap.set(dateKey, runningBalance);
  }

  const cumulativeBalance: CumulativeBalance[] = Array.from(
    balanceMap.entries(),
  ).map(([date, balance]) => ({
    date: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(new Date(date)),
    balance,
  }));

  return { summary, cashFlow, categorySpending, cumulativeBalance };
}
