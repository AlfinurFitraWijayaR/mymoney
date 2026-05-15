import { useState } from "react";
import Image from "next/image";

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  icon: string;
  deadline: string | Date;
  created_at: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export const CATEGORIES = [
  { value: "general", label: "Umum", icon: "umum.svg" },
  { value: "travel", label: "Liburan", icon: "liburan.svg" },
  { value: "education", label: "Pendidikan", icon: "pendidikan.svg" },
  { value: "gadget", label: "Gadget", icon: "e-wallet.svg" },
  { value: "vehicle", label: "Kendaraan", icon: "kendaraan.svg" },
  { value: "home", label: "Rumah", icon: "rumah.svg" },
  { value: "wedding", label: "Pernikahan", icon: "pernikahan.svg" },
  { value: "investment", label: "Investasi", icon: "investasi.svg" },
  { value: "health", label: "Kesehatan", icon: "kesehatan.svg" },
];

export function formatDeadline(d: string | Date) {
  return new Date(d).toISOString().split("T")[0];
}

export function GoalFormFields({
  defaults,
  selectedCategory,
  setSelectedCategory,
}: {
  defaults?: Goal;
  selectedCategory: (typeof CATEGORIES)[0];
  setSelectedCategory: (cat: (typeof CATEGORIES)[0]) => void;
}) {
  const [amount, setAmount] = useState(() =>
    defaults?.target_amount ? defaults.target_amount.toString() : "",
  );

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
      {/* Nama Target */}
      <div className="form-group">
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          nama target
        </label>
        <input
          name="title"
          type="text"
          className="input"
          placeholder="cth. Liburan ke Jepang"
          required
          maxLength={100}
          defaultValue={defaults?.title}
        />
      </div>

      {/* Target Dana */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Target Dana
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-400">
            Rp
          </span>
          <input
            name="target_amount"
            type="text"
            inputMode="numeric"
            value={formatDisplay(amount)}
            onChange={handleAmountChange}
            placeholder="0"
            required
            className="w-full pl-12 pr-4 py-2 font-semibold text-zinc-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.value === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 justify-center p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-zinc-600 hover:border-slate-300"
                }`}
              >
                <Image
                  src={`/targets/${cat.icon}`}
                  alt={cat.label}
                  width={20}
                  height={20}
                />
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="category" value={selectedCategory.value} />
      </div>

      {/* Tanggal Selesai Target */}
      <div className="form-group">
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Tanggal Selesai Target
        </label>
        <input
          name="deadline"
          type="date"
          className="input"
          required
          min={new Date().toISOString().split("T")[0]}
          defaultValue={defaults ? formatDeadline(defaults.deadline) : ""}
        />
      </div>
    </>
  );
}
