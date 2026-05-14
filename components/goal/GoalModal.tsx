import { createPortal } from "react-dom";
import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { GoalFormFields, Goal, CATEGORIES } from "./GoalForm";

interface InsertModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedCategory: (typeof CATEGORIES)[0];
  setSelectedCategory: (cat: (typeof CATEGORIES)[0]) => void;
  loading: boolean;
  error: string | null;
}

export function GoalInsertModal({
  open,
  onClose,
  onSubmit,
  selectedCategory,
  setSelectedCategory,
  loading,
  error,
}: InsertModalProps) {
  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={cn(
          "bg-white w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out relative z-10",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 border-b border-slate-100">
          {/* Title */}
          <h2 className="text-lg font-bold text-zinc-800">
            Tambah Target Baru
          </h2>
          {/* Icon Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 pt-6 overflow-y-auto max-h-[70vh]">
          <form
            id="create-goal-form"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <GoalFormFields
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {error && <p className="error-text">{error}</p>}
          </form>
        </div>

        {/* Footer Action */}
        <div className="px-6 pb-6 border-t border-slate-100 bg-white pt-6">
          <button
            type="submit"
            form="create-goal-form"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl font-semibold text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {loading ? "Membuat…" : "Buat Target"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaults?: Goal;
  selectedCategory: (typeof CATEGORIES)[0];
  setSelectedCategory: (cat: (typeof CATEGORIES)[0]) => void;
  loading: boolean;
  error: string | null;
}

export function GoalEditModal({
  open,
  onClose,
  onSubmit,
  defaults,
  selectedCategory,
  setSelectedCategory,
  loading,
  error,
}: EditModalProps) {
  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={cn(
          "bg-white w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out relative z-10",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-zinc-800">
            Edit Target Sasaran
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>

        {/* Main Form */}
        <div className="px-6 pb-6 pt-6 overflow-y-auto max-h-[70vh]">
          <form
            id="edit-goal-form"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <GoalFormFields
              defaults={defaults}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {error && <p className="error-text">{error}</p>}
          </form>
        </div>

        {/* Footer Action */}
        <div className="px-6 pb-6 border-t border-slate-100 bg-white pt-6">
          <button
            type="submit"
            form="edit-goal-form"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl font-semibold text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {loading ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface UpdateBalanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  balanceTarget: Goal | null;
  balanceAction: "setor" | "tarik" | null;
  walletId: string;
  setWalletId: (val: string) => void;
  amount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatDisplay: (val: string) => string;
  displayWallets: any[];
  loading: boolean;
  error: string | null;
}

export function GoalUpdateModal({
  open,
  onClose,
  onSubmit,
  balanceTarget,
  balanceAction,
  walletId,
  setWalletId,
  amount,
  handleAmountChange,
  formatDisplay,
  displayWallets,
  loading,
  error,
}: UpdateBalanceModalProps) {
  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className={cn(
          "bg-white w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out relative z-10",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 border-b border-slate-100">
          <h2 className="font-semibold text-zinc-800">
            {balanceAction === "tarik" ? "Tarik Saldo" : "Setor Saldo"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 pt-6 overflow-y-auto max-h-[70vh]">
          <form
            id="update-balance-form"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            {balanceTarget && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={`/${balanceTarget.icon}`}
                    width={44}
                    height={44}
                    alt={balanceTarget.title}
                  />
                  <div>
                    <p className="font-semibold text-zinc-800 text-sm">
                      {balanceTarget.title}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                      Sisa: Rp{" "}
                      {formatCurrency(
                        balanceTarget.target_amount -
                          balanceTarget.current_amount,
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${Math.min((balanceTarget.current_amount / balanceTarget.target_amount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Wallets Select */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Pilih Dompet
              </label>
              <div className="grid grid-cols-3 gap-2">
                {displayWallets.map((wal) => {
                  const isSelected = walletId === wal.id;
                  const isInsufficient =
                    balanceAction === "setor" &&
                    Number(amount) > Number(wal.balance);

                  return (
                    <button
                      key={wal.id}
                      type="button"
                      disabled={isInsufficient}
                      onClick={() => setWalletId(wal.id)}
                      className={`relative flex gap-2 items-center justify-center py-3 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                          : isInsufficient
                            ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                            : "border-slate-200 bg-white font-normal text-zinc-500 hover:border-slate-300"
                      }`}
                    >
                      <Image
                        src={`/${wal.name.toLowerCase()}.svg`}
                        width={16}
                        height={16}
                        alt={wal.name}
                        className={
                          isSelected
                            ? ""
                            : isInsufficient
                              ? "grayscale opacity-30"
                              : "grayscale opacity-80"
                        }
                      />
                      <span className="text-xs font-medium">
                        {wal.name.toUpperCase()}
                      </span>
                      {isInsufficient && (
                        <div className="absolute -top-1 -right-1">
                          <span className="bg-rose-500 text-white text-[7px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                            SALDO KURANG
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nominal Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Nominal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-400">
                  Rp
                </span>
                <input
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  value={formatDisplay(amount)}
                  onChange={handleAmountChange}
                  placeholder="0"
                  required
                  className="w-full pl-12 pr-4 py-4 font-bold text-xl text-zinc-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <input
                  type="hidden"
                  name="type"
                  value={balanceAction || "setor"}
                />
                {balanceAction === "tarik" && balanceTarget && Number(amount) > balanceTarget.current_amount && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-rose-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      MELEBIHI SALDO
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}
          </form>
        </div>

        {/* Footer Action */}
        <div className="px-6 pb-6 border-t border-slate-100 bg-white pt-6">
          <button
            type="submit"
            form="update-balance-form"
            disabled={
              loading ||
              (balanceAction === "setor" &&
                walletId !== "" &&
                Number(amount) >
                  Number(
                    displayWallets.find((w) => w.id === walletId)?.balance || 0,
                  )) ||
              (balanceAction === "tarik" &&
                balanceTarget !== null &&
                Number(amount) > balanceTarget.current_amount)
            }
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl font-semibold text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {loading
              ? "Menyimpan…"
              : balanceAction === "tarik"
                ? "Tarik Saldo"
                : "Setor Saldo"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
