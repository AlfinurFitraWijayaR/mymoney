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

  // ── Parallel fetch: aggregates + transactions in ONE round-trip ──
  const [groupedByType, transactions] = await Promise.all([
    // Single groupBy instead of two aggregates
    prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: { amount: true },
    }),
    // Single findMany with category join for all chart data
    prisma.transaction.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true,
        category: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  // ── Summary ────────────────────────────────────────────────
  const totalIncome = Number(
    groupedByType.find((g) => g.type === "INCOME")?._sum.amount ?? 0
  );
  const totalExpense = Number(
    groupedByType.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0
  );

  const summary: StatsSummary = {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
  };

  // ── Cash Flow, Category Spending, and Cumulative Balance ──
  // Process all three from the single transactions array (no extra DB queries)
  const cashFlowMap = new Map<string, { income: number; expense: number }>();
  const catMap = new Map<string, number>();
  let runningBalance = 0;
  const balanceMap = new Map<string, number>();

  if (month) {
    // Pre-populate days for month view
    const daysInMonth = new Date(targetYear, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      cashFlowMap.set(String(d).padStart(2, "0"), { income: 0, expense: 0 });
    }
  } else {
    // Pre-populate months for yearly view
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    for (let m = 0; m < 12; m++) {
      cashFlowMap.set(monthNames[m], { income: 0, expense: 0 });
    }
  }

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  for (const tx of transactions) {
    const txDate = new Date(tx.date);
    const amt = tx.amount;

    // Cash flow
    const cfKey = month
      ? String(txDate.getDate()).padStart(2, "0")
      : monthNames[txDate.getMonth()];
    const cfEntry = cashFlowMap.get(cfKey);
    if (cfEntry) {
      if (tx.type === "INCOME") cfEntry.income += amt;
      else cfEntry.expense += amt;
    }

    // Category spending (expenses only)
    if (tx.type === "EXPENSE") {
      const catName = tx.category.name;
      catMap.set(catName, (catMap.get(catName) ?? 0) + amt);
    }

    // Cumulative balance
    const dateKey = txDate.toISOString().split("T")[0];
    if (tx.type === "INCOME") runningBalance += amt;
    else runningBalance -= amt;
    balanceMap.set(dateKey, runningBalance);
  }

  const cashFlow: MonthlyCashFlow[] = Array.from(cashFlowMap.entries()).map(
    ([month, data]) => ({ month, income: data.income, expense: data.expense }),
  );

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

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  });

  const cumulativeBalance: CumulativeBalance[] = Array.from(
    balanceMap.entries(),
  ).map(([date, balance]) => ({
    date: dateFormatter.format(new Date(date)),
    balance,
  }));

  return { summary, cashFlow, categorySpending, cumulativeBalance };
}
