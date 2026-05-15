import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { getWallets } from "@/lib/actions/wallets";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ProfileSupport from "@/components/profile/ProfileSupport";
import WalletList from "@/components/profile/WalletList";

export const metadata = { title: "Profil – mymoney" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  const [getAlias, wallets] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { alias: true, username: true },
    }),
    getWallets(),
  ]);

  const initials =
    getAlias?.alias?.substring(0, 1).toUpperCase() ||
    session?.username?.substring(0, 1).toUpperCase();

  const supportItems = [
    {
      icon: "/call.svg",
      label: "Hubungi Admin",
      href: "https://wa.me/6285524607359?text=Halo%2C%20saya%20butuh%20bantuan%20dengan%20akun%20mymoney%20saya.",
    },
    { icon: "/password.svg", label: "Ganti Password", href: "" },
  ];

  const defaultWallets = [
    { name: "CASH", type: "CASH" },
    { name: "E-WALLET", type: "EWALLET" },
    { name: "BANK", type: "BANK" },
  ];

  const dbWalletNames = new Set(wallets.map((w: any) => w.name.toUpperCase()));
  const missingDefaults = defaultWallets.filter(
    (def) => !dbWalletNames.has(def.name.toUpperCase()),
  );

  const displayWallets = [
    ...wallets,
    ...missingDefaults.map((def: any) => ({
      id: `default-${def.name.toLowerCase()}`,
      name: def.name,
      balance: 0,
      type: def.type,
    })),
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header / Profile Info */}
      <div className="px-6 py-2 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-200 mb-4">
            {initials}
          </div>
          <div className="absolute bottom-4 right-0 w-7 h-7 bg-emerald-500 border-4 border-white rounded-full"></div>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 capitalize mb-1">
          {getAlias?.alias || session?.username}
        </h1>
        <p className="text-white/90 text-xs rounded-full px-3 py-2 bg-black w-fit mx-auto flex items-center gap-1">
          {session?.role === "ADMIN" ? "Administrator" : "Member Premium"}
          <Image src="/star.svg" width={18} height={18} alt="Star" />
        </p>
      </div>

      <div className="px-2">
        {/* Wallet Section */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Dompet Saya
          </h3>
          <div className="bg-white rounded-xl shadow-sm text-zinc-900 p-4">
            <WalletList wallets={displayWallets} />
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">
              Dukungan
            </h3>
            <ProfileSupport items={supportItems} />

            {/* Logout */}
            <form action={logoutAction} className="mt-2">
              <button className="w-full bg-white rounded-2xl border border-slate-100 flex items-center gap-3 p-4 text-zinc-700 hover:bg-red-50 text-sm font-medium transition-all active:scale-[0.98]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-zinc-600/80"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>

                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
