// components/ui/ConfirmDialog.tsx
"use client";

import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-zinc-500 text-sm leading-relaxed">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Batal
        </button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? "Menghapus…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

interface TargetDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function TargetDialog({
  open,
  onClose,
  title,
  message,
}: TargetDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-zinc-500 text-sm leading-relaxed">{message}</p>
    </Modal>
  );
}
