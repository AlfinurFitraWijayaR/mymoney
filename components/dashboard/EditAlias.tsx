"use client";

import { useState } from "react";
import { updateUserAlias } from "@/lib/actions/user";

interface EditAliasProps {
  initialAlias: string | null;
  username: string;
}

export function EditAlias({ initialAlias, username }: EditAliasProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(initialAlias || "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const res = await updateUserAlias(alias);
    if (res.success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Nama alias..."
          className="bg-primary-500/30 border border-primary-400/50 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white/50 text-white w-15"
          autoFocus
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="text-white hover:text-emerald-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-white hover:text-rose-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-1 group">
      <h1 className="text-lg font-bold tracking-tight">
        Hai <span className="capitalize">{initialAlias || username}</span>!
      </h1>
      <button
        onClick={() => setIsEditing(true)}
        className="text-zinc-200 hover:text-white p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
    </div>
  );
}
