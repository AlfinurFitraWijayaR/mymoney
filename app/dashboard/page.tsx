import { getDashboardStats, getTransactions } from "@/lib/actions/transactions";
import { getWallets } from "@/lib/actions/wallets";
import { getSession } from "@/lib/auth";
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getMonthLabel,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EditAlias } from "@/components/dashboard/EditAlias";
import { BalanceSwitcher } from "@/components/dashboard/BalanceSwitcher";

export const metadata = { title: "Dashboard – mymoney" };

interface PageProps {
  searchParams: { month?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const month = searchParams.month ?? getCurrentMonth();
  const session = await getSession();

  const [monthlyStats, overallStats, recentTransactions, userData, wallets] =
    await Promise.all([
      getDashboardStats(month),
      getDashboardStats(),
      getTransactions(month),
      session
        ? prisma.user.findUnique({
            where: { id: session.userId },
            select: { alias: true, username: true },
          })
        : null,
      getWallets(),
    ]);

  const recent = recentTransactions.slice(0, 3);

  return (
    <div className="-m-4 md:-m-8">
      {/* Premium Blue Header Section */}
      <div className="bg-primary-600 text-white pt-4 pb-16 px-6 rounded-b-[1.5rem] shadow-xl relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-primary-700/30 rounded-full blur-2xl"></div>

        {/* Top Bar: Profile & Welcome */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          {/* Welcome */}
          <div className="flex items-center gap-2">
            <Image src="/hello.svg" alt="Avatar" width={25} height={25} />
            <EditAlias
              initialAlias={userData?.alias || null}
              username={userData?.username || session?.username || "User"}
            />
          </div>

          {/* Profile */}
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </Link>
        </div>

        {/* Balance Switcher & Stats */}
        <BalanceSwitcher
          monthlyStats={monthlyStats}
          overallStats={overallStats}
          monthLabel={getMonthLabel(month)}
          wallets={wallets}
        />
      </div>

      {/* Motivational Quote */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-primary-500/5 p-4 border border-primary-100/50 group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500">
          {/* Decorative background quote icon */}
          <div className="absolute -top-6 -right-2 text-primary-50 transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21L16.417 14.593L16.417 3L21.017 3L21.017 14.593L18.617 21L14.017 21ZM3.017 21L5.417 14.593L5.417 3L10.017 3L10.017 14.593L7.617 21L3.017 21Z" />
            </svg>
          </div>

          <div className="relative z-10 flex gap-4 items-center">
            <Image
              src="/lampu.svg"
              alt="Insight"
              width={28}
              height={28}
              className="drop-shadow-sm"
            />
            <div className="flex-1 py-1">
              <p className="text-[13px] md:text-sm font-semibold text-zinc-600 pr-4">
                {
                  [
                    '"Harga kecil yang dibayar untuk disiplin jauh lebih murah daripada harga besar yang dibayar untuk penyesalan." — Warren Buffett',
                    '"Jangan menabung dari sisa pengeluaran, tetapi belanjakan dari sisa tabungan." — Warren Buffett',
                    '"Investasi terbaik yang bisa kamu lakukan adalah investasi pada dirimu sendiri." — Warren Buffett',
                    '"Orang kaya memiliki televisi kecil dan perpustakaan besar, orang miskin memiliki perpustakaan kecil dan televisi besar." — Zig Ziglar',
                    '"Bukan berapa banyak uang yang kamu hasilkan, tapi berapa banyak yang kamu simpan." — Robert Kiyosaki',
                    '"Kebiasaan sederhana dalam mengatur uang akan menentukan masa depanmu." — Dave Ramsey',
                    '"Tujuan bukan sekadar menghasilkan uang, tetapi menciptakan kebebasan." — Tony Robbins',
                    '"Kekayaan sejati adalah kemampuan untuk hidup sesuai keinginanmu." — Morgan Housel',
                    '"Disiplin finansial lebih penting daripada kecerdasan finansial." — Dave Ramsey',
                    '"Uang hanyalah alat. Ia akan membawamu ke mana pun kamu mau, tetapi tidak akan menggantikan dirimu sebagai pengemudi." — Ayn Rand',
                    '"Jangan pernah bergantung pada satu sumber penghasilan." — Warren Buffett',
                    '"Orang sukses membuat uang bekerja untuk mereka." — Robert Kiyosaki',
                    '"Kebebasan finansial tersedia bagi mereka yang mau mempelajarinya." — Robert Kiyosaki',
                    '"Jika kamu membeli hal yang tidak dibutuhkan, suatu hari kamu akan menjual hal yang kamu butuhkan." — Warren Buffett',
                    '"Kesabaran adalah kunci utama dalam membangun kekayaan." — Charlie Munger',
                    '"Keamanan finansial bukan tentang seberapa besar penghasilanmu, tetapi seberapa baik kamu mengelolanya." — Suze Orman',
                    '"Banyak orang gagal bukan karena kurang uang, tetapi karena kurang perencanaan." — Dave Ramsey',
                    '"Waktu adalah teman terbaik investasi yang baik." — Warren Buffett',
                    '"Kekayaan dibangun dari keputusan kecil yang konsisten." — Morgan Housel',
                    '"Kesuksesan finansial dimulai ketika kamu berhenti hidup hanya untuk terlihat kaya." — Thomas J. Stanley',
                  ][Math.floor(Math.random() * 10)]
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 py-8 space-y-8">
        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-zinc-800">
              Transaksi Terakhir
            </h3>
            <a
              href="/transactions"
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>

          <div className="space-y-3">
            {recent.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-zinc-100 shadow-sm">
                <p className="text-zinc-400 text-sm">
                  Belum ada transaksi bulan ini
                </p>
              </div>
            ) : (
              recent.map((tx: any) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between border border-zinc-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
                        tx.type === "INCOME"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
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
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
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
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-600 text-xs md:text-sm">
                        {tx.description || "Tanpa Keterangan"}
                      </p>
                      <p className="text-zinc-400 text-[11px] font-medium mt-1">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        tx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? "Rp" : "Rp"}{" "}
                      {formatCurrency(Number(tx.amount))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
