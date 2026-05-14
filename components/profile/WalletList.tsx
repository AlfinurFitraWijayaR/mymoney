"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { setupWalletAction } from "@/lib/actions/wallets";
import { useRouter } from "next/navigation";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  type?: string;
}

interface WalletListProps {
  wallets: Wallet[];
}

export default function WalletList({ wallets }: WalletListProps) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleWalletClick = (wallet: Wallet) => {
    if (wallet.balance === 0) {
      setSelectedWallet(wallet);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWallet) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("name", selectedWallet.name);

    let type = selectedWallet.type;
    if (!type) {
      if (selectedWallet.name === "CASH") type = "CASH";
      else if (selectedWallet.name === "E-WALLET") type = "EWALLET";
      else if (selectedWallet.name === "BANK") type = "BANK";
      else type = "CASH";
    }
    formData.append("type", type);
    formData.append("amount", amount);

    const result = await setupWalletAction(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSelectedWallet(null);
      router.refresh();
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.length === 0 ? (
          <p className="text-sm text-zinc-500 col-span-full text-center py-4">
            Belum ada dompet terdaftar
          </p>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => handleWalletClick(wallet)}
              className={`bg-blue-500/5 rounded-xl p-3 backdrop-blur-md border border-black/10 flex items-center gap-3 transition-all ${
                wallet.balance === 0
                  ? "cursor-pointer hover:bg-blue-500/10 active:scale-[0.98]"
                  : ""
              }`}
            >
              <Image
                src={`/${wallet.name}.svg`}
                width={35}
                height={35}
                alt={wallet.name.toLowerCase()}
              />
              <div className="flex flex-col text-blue-500">
                <span className="text-xs font-semibold uppercase">
                  {wallet.name}
                </span>
                <p className="text-sm font-bold truncate text-zinc-900">
                  <span className="text-xs font-normal -mr-0.5">Rp. </span>
                  {formatCurrency(wallet.balance)}
                </p>
                {wallet.balance === 0 && (
                  <span className="text-[10px] text-zinc-400 font-medium italic -mt-0.5">
                    Klik untuk atur saldo
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        title={`Atur Saldo ${selectedWallet?.name}`}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="label uppercase tracking-wider text-[10px] text-zinc-400 font-bold">
              Saldo Awal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                Rp.
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatDisplay(amount)}
                onChange={handleAmountChange}
                placeholder="0"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-xl font-bold text-zinc-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <p className="text-[10px] text-red-400 mt-2 italic">
              * Saldo dompet hanya bisa diatur sekali. Pastikan mengisi dengan
              benar
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Menyimpan..." : "Simpan Saldo"}
          </button>
        </form>
      </Modal>
    </>
  );
}
