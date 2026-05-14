// app/admin/users/UsersClient.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { createUser, deleteUser, resetPassword } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  role: "ADMIN" | "MEMBER";
  tenantId: string;
  createdAt: string;
}

export default function UsersClient({ users }: { users: User[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createUser(fd);
    setLoading(false);
    if (result?.error) {
      const msg =
        typeof result.error === "string"
          ? result.error
          : Object.values(result.error).flat().join(", ");
      setError(msg);
      return;
    }
    setSuccess("User created successfully");
    setCreateOpen(false);
    setTimeout(() => setSuccess(null), 3000);
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!resetTarget) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("userId", resetTarget.id);
    const result = await resetPassword(fd);
    setLoading(false);
    if (result?.error) {
      const msg = Object.values(result.error).flat().join(", ");
      setError(msg);
      return;
    }
    setSuccess("Password reset successfully");
    setResetTarget(null);
    setTimeout(() => setSuccess(null), 3000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    const result = await deleteUser(deleteTarget.id);
    setLoading(false);
    if (result?.error) {
      alert(result.error);
    }
    setDeleteTarget(null);
  }

  return (
    <>
      {/* Success toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg text-sm font-medium">
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
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          {success}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-end">
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
          Create User
        </button>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-surface-500">No users found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Tenant ID</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-brand-700 uppercase">
                          {user.username[0]}
                        </span>
                      </div>
                      <span className="font-medium text-surface-900">
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        user.role === "ADMIN" ? "badge-admin" : "badge-member"
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <code className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded">
                      {user.tenantId}
                    </code>
                  </td>
                  <td className="text-surface-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setError(null);
                          setResetTarget(user);
                        }}
                        className="btn-ghost p-1.5"
                        title="Reset Password"
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
                            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="btn-ghost p-1.5 hover:text-red-600 hover:bg-red-50"
                        title="Delete User"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Username</label>
              <input
                name="username"
                type="text"
                className="input"
                placeholder="john_doe"
                required
                minLength={3}
                maxLength={50}
                pattern="[a-z0-9_]+"
                title="Lowercase letters, numbers, underscores only"
              />
              <p className="text-xs text-surface-400 mt-1">
                Lowercase, numbers & underscores
              </p>
            </div>
            <div className="form-group">
              <label className="label">Role</label>
              <select name="role" className="input" defaultValue="MEMBER">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input name="password" type="password" className="input" required />
          </div>

          <div className="form-group">
            <label className="label">Tenant ID</label>
            <input
              name="tenantId"
              type="text"
              className="input"
              placeholder="tenant_company_name"
              required
              minLength={3}
              maxLength={50}
              pattern="[a-z0-9_]+"
              title="Lowercase letters, numbers, underscores only"
            />
            <p className="text-xs text-surface-400 mt-1">
              Unique identifier for data isolation. Users with the same tenant
              ID share data access.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        open={!!resetTarget}
        onClose={() => {
          setResetTarget(null);
          setError(null);
        }}
        title="Reset Password"
        size="sm"
      >
        {resetTarget && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="p-3 rounded-lg bg-surface-50 border border-surface-200 text-sm">
              <span className="text-surface-500">Resetting password for </span>
              <span className="font-semibold text-surface-900">
                {resetTarget.username}
              </span>
            </div>

            <div className="form-group">
              <label className="label">New Password</label>
              <input
                name="newPassword"
                type="password"
                className="input"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoFocus
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setResetTarget(null);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.username}"? This will permanently delete all this user's data. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete User"
        loading={loading}
      />
    </>
  );
}
