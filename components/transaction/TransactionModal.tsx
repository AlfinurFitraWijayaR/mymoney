import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { TransactionForm } from "./TransactionForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: Category[];
  wallets: any[];
  loading: boolean;
  error: string | null;
}

interface CreateModalProps extends BaseModalProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function TransactionCreateModal({
  open,
  onClose,
  form,
  setForm,
  categories,
  wallets,
  onSubmit,
  loading,
  error,
}: CreateModalProps) {
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
          <h2 className="font-semibold text-zinc-800">Tambah Transaksi</h2>
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

        {/* Form Main */}
        <div className="px-6 pb-6 pt-6 overflow-y-auto max-h-[70vh]">
          <TransactionForm
            formId="create-tx-form"
            form={form}
            setForm={setForm}
            categories={categories}
            wallets={wallets}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {/* Footer Button */}
        <div className="px-6 pb-6 border-t border-slate-100 bg-white pt-6">
          <button
            type="submit"
            form="create-tx-form"
            disabled={loading || wallets.length === 0}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl font-semibold text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {loading ? "Menyimpan…" : "Simpan Transaksi"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface EditModalProps extends BaseModalProps {
  editTarget: any | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDeleteClick: () => void;
}

export function TransactionEditModal({
  open,
  onClose,
  editTarget,
  form,
  setForm,
  categories,
  wallets,
  onSubmit,
  onDeleteClick,
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
            {editTarget?.category?.name === "Target Sasaran"
              ? "Detail Transaksi"
              : "Edit Transaksi"}
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

        {/* Form Main */}
        <div className="px-6 pb-6 pt-6 overflow-y-auto max-h-[70vh]">
          <TransactionForm
            formId="edit-tx-form"
            form={form}
            setForm={setForm}
            categories={categories}
            wallets={wallets}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            readOnly={editTarget?.category?.name === "Target Sasaran"}
          />
        </div>

        {/* Footer Button */}
        <div className="flex justify-between items-center gap-4 px-6 pb-6 border-t border-slate-100 bg-white pt-6">
          <button
            type="button"
            onClick={onDeleteClick}
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all"
          >
            {loading ? "Menghapus…" : "Hapus"}
          </button>
          {editTarget?.category?.name !== "Target Sasaran" &&
            editTarget?.category?.name !== "Target Keuangan" && (
              <button
                type="submit"
                form="edit-tx-form"
                disabled={loading || wallets.length === 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
              >
                {loading ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function TransactionDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return createPortal(
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Transaksi"
      message="Apakah kamu yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
      loading={loading}
    />,
    document.body,
  );
}
