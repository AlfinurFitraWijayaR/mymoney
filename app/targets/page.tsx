import { getGoals } from "@/lib/actions/goals";
import { getWallets } from "@/lib/actions/wallets";
import GoalsClient from "./GoalsClient";

export const metadata = { title: "Financial Goals – mymoney" };

export default async function TargetsPage() {
  const goals = await getGoals();
  const wallets = await getWallets();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <GoalsClient goals={goals} wallets={wallets} />
    </div>
  );
}
