"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  svg_code: string;
}

export default function CategoriesClient({
  categories,
  role,
}: {
  categories: Category[];
  role: string;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = role === "ADMIN";

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createCategory(fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Silakan periksa input Anda",
      );
      return;
    }
    setCreateOpen(false);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTarget) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await updateCategory(editTarget.id, fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Silakan periksa input Anda",
      );
      return;
    }
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteCategory(deleteTarget);
    setLoading(false);
    if (result?.error) {
      alert(result.error);
    }
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="flex justify-end">
        {/* tambah category */}
        {isAdmin && (
          <button
            onClick={() => {
              setError(null);
              setCreateOpen(true);
            }}
            className="btn-primary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tambah Kategori
          </button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-surface-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
            </svg>
          </div>
          <p className="text-surface-600 font-medium mb-1">
            Belum ada kategori
          </p>
          <p className="text-surface-400 text-sm">
            Kategori membantu Anda mengelola transaksi
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">Icon</th>
                <th className="text-left">Name</th>
                <th className="text-left">Type</th>
                {isAdmin && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat: any) => (
                <tr key={cat.id}>
                  <td className="w-12">
                    <div
                      className="w-5 h-5 rounded-lg bg-surface-100 flex items-center justify-center text-zinc-600"
                      dangerouslySetInnerHTML={{ __html: cat.svg_code ?? "" }}
                    />
                  </td>
                  <td>
                    <span className="font-medium">{cat.name}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        cat.type === "INCOME" ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {cat.type}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setError(null);
                            setEditTarget(cat);
                          }}
                          className="btn-ghost p-1.5"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat.id)}
                          className="btn-ghost p-1.5 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah Kategori"
        size="sm"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="label">Nama Kategori</label>
            <input
              name="name"
              type="text"
              className="input"
              placeholder="cth. Makanan"
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label className="label">Jenis Transaksi</label>
            <select name="type" className="input" required>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Kode Ikon SVG</label>
            <textarea
              name="svg_code"
              className="input font-mono text-xs"
              placeholder="<svg ...>...</svg>"
              required
              rows={3}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Membuat…" : "Buat Kategori"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Kategori"
        size="sm"
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="label">Nama Kategori</label>
            <input
              name="name"
              type="text"
              className="input"
              defaultValue={editTarget?.name}
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label className="label">Jenis Transaksi</label>
            <select
              name="type"
              className="input"
              defaultValue={editTarget?.type}
              required
            >
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Kode Ikon SVG</label>
            <textarea
              name="svg_code"
              className="input font-mono text-xs"
              defaultValue={editTarget?.svg_code}
              required
              rows={3}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setEditTarget(null)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        message="Apakah anda yakin ingin menghapus kategori ini?"
        loading={loading}
      />
    </>
  );
}
