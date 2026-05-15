import Image from "next/image";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  svg_code?: string | null;
}

interface FormState {
  amount: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  walletId: string;
  description: string;
  date: string;
}

export function TransactionForm({
  form,
  setForm,
  categories,
  wallets,
  onSubmit,
  loading,
  error,
  formId,
  readOnly = false,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: Category[];
  wallets: any[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string | null;
  formId: string;
  readOnly?: boolean;
}) {
  const filteredCategories = categories.filter(
    (c) => c.type === form.type && c.name.toLowerCase() !== "target keuangan",
  );

  const formatDisplay = (val: string) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const value = e.target.value.replace(/\./g, "");
    if (/^\d*$/.test(value)) {
      setForm({ ...form, amount: value });
    }
  };

  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    if (readOnly) return;
    const firstCat = categories.find((c) => c.type === newType);
    setForm({
      ...form,
      type: newType,
      categoryId: firstCat ? firstCat.id : "",
    });
  };

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div
        className={`flex p-1 rounded-xl ${readOnly ? "bg-slate-50 opacity-80" : "bg-slate-100"}`}
      >
        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("INCOME")}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
            form.type === "INCOME"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-zinc-500"
          } ${readOnly ? "cursor-default" : ""}`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          disabled={readOnly}
          onClick={() => handleTypeChange("EXPENSE")}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
            form.type === "EXPENSE"
              ? "bg-white text-rose-600 shadow-sm"
              : "text-zinc-500"
          } ${readOnly ? "cursor-default" : ""}`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Nominal Input */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Nominal
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-zinc-400">
            Rp
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatDisplay(form.amount)}
            onChange={handleAmountChange}
            placeholder="0"
            required
            disabled={readOnly}
            className={`w-full pl-12 pr-4 py-4 text-xl font-bold text-zinc-800 border rounded-xl focus:outline-none transition-all ${
              readOnly
                ? "bg-slate-50 border-slate-100 text-zinc-400 cursor-default"
                : "bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            }`}
          />
          <input type="hidden" name="amount" value={form.amount} />
          <input type="hidden" name="type" value={form.type} />
          <input type="hidden" name="categoryId" value={form.categoryId} />
          <input type="hidden" name="walletId" value={form.walletId} />
          <input type="hidden" name="date" value={form.date} />
        </div>
      </div>

      {/* Wallets Select */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Pilih Dompet
        </label>
        <div className="grid grid-cols-3 gap-2">
          {wallets.length === 0 ? (
            <div className="col-span-3 p-4 rounded-xl border border-dashed border-red-300 bg-red-50 text-center">
              <p className="text-sm text-zinc-500">
                Atur dompetmu di halaman profile
              </p>
            </div>
          ) : (
            wallets.map((wal) => {
              const isSelected = form.walletId === wal.id;
              const isInsufficient =
                !readOnly &&
                form.type === "EXPENSE" &&
                Number(form.amount) > Number(wal.balance);

              return (
                <button
                  key={wal.id}
                  type="button"
                  disabled={readOnly || isInsufficient}
                  onClick={() => setForm({ ...form, walletId: wal.id })}
                  className={`relative flex gap-1 items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : isInsufficient || (readOnly && !isSelected)
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
                        : isInsufficient || readOnly
                          ? "grayscale opacity-30"
                          : "grayscale opacity-80"
                    }
                  />
                  <span className="text-xs font-medium">
                    {wal.name.toUpperCase()}
                  </span>
                  {!readOnly && isInsufficient && (
                    <div className="absolute -top-1 -right-1">
                      <span className="bg-rose-500 text-white text-[7px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                        SALDO KURANG
                      </span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Kategori
        </label>
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {filteredCategories.map((cat) => {
            const isSelected = form.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={readOnly}
                onClick={() => setForm({ ...form, categoryId: cat.id })}
                className={`flex items-center gap-0.5 justify-center p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                    : readOnly
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-default"
                      : "border-slate-200 bg-white text-zinc-600 hover:border-slate-300"
                }`}
              >
                <span
                  className="w-5 h-5 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: cat.svg_code || "" }}
                />
                <span className="text-xs font-medium text-center line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note Input */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          Catatan (Opsional)
        </label>
        <input
          name="description"
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="cth: Ngopi bareng tim"
          disabled={readOnly}
          className={`w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none ${
            readOnly
              ? "bg-slate-50 border-slate-100 text-zinc-400 cursor-default"
              : "bg-slate-50 border-slate-200 text-zinc-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
          }`}
        />
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
