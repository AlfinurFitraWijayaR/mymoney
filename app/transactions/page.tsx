import { getTransactions } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import { getWallets } from "@/lib/actions/wallets";
import TransactionsClient from "./TransactionsClient";

export const metadata = { title: "Transactions – mymoney" };

interface PageProps {
  searchParams: { month?: string };
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const month = searchParams.month;

  const [transactions, categories, wallets] = await Promise.all([
    getTransactions(month),
    getCategories(),
    getWallets(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <TransactionsClient
        transactions={transactions.map((t: any) => ({
          ...t,
          createdAt: t.created_at,
          categoryId: t.category_id,
        }))}
        categories={categories}
        wallets={wallets}
        month={month || ""}
      />
    </div>
  );
}
