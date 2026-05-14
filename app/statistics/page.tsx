import StatisticsClient from "./StatisticsClient";

export const metadata = { title: "Statistics – mymoney" };

export default function StatisticsPage() {
  return (
    <div className="-m-4 md:-m-8">
      <StatisticsClient />
    </div>
  );
}
