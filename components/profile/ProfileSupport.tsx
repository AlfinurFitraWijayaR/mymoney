"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChangePasswordModal from "./ChangePasswordModal";

interface SupportItem {
  icon: string;
  label: string;
  href: string;
}

const icon = (
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
    className="text-zinc-400"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function ProfileSupport({ items }: { items: SupportItem[] }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {items.map((item, i) => {
          const isChangePassword = item.label
            .toLowerCase()
            .includes("password");

          if (isChangePassword) {
            return (
              <button
                key={i}
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50 text-left"
              >
                <div className="flex items-center gap-3 text-zinc-700">
                  <Image
                    src={item.icon}
                    width={20}
                    height={20}
                    alt={item.label}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {icon}
              </button>
            );
          }

          return (
            <Link
              key={i}
              href={item.href}
              target="_blank"
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50"
            >
              <div className="flex items-center gap-3 text-zinc-700">
                <Image
                  src={item.icon}
                  width={20}
                  height={20}
                  alt={item.label}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {icon}
            </Link>
          );
        })}
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
