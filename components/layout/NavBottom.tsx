"use client";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createTransaction } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import { getWallets } from "@/lib/actions/wallets";
import { TransactionCreateModal } from "../transaction/TransactionModal";

interface SidebarProps {
  role: Role;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  memberOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Admin Panel",
    adminOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    adminOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    href: "/dashboard",
    label: "Beranda",
    memberOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transaksi",
    memberOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    href: "/statistics",
    label: "Statistik",
    memberOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <line x1="6" y1="20" x2="6" y2="14"></line>
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
      </svg>
    ),
  },
  {
    href: "/targets",
    label: "Target",
    memberOnly: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
  },
  {
    href: "/categories",
    label: "Kategori",
    adminOnly: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h.008v.008H6V6z"
        />
      </svg>
    ),
  },
];

const emptyForm = {
  amount: "",
  type: "INCOME" as "INCOME" | "EXPENSE",
  categoryId: "",
  walletId: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export function NavBottom({ role }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbWallets, setDbWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      Promise.all([getCategories(), getWallets()]).then(([cats, wals]) => {
        setDbCategories(cats as any);
        setDbWallets(wals as any);
        setForm((prev) => ({
          ...prev,
          categoryId:
            prev.categoryId ||
            (cats as any).find((c: any) => c.type === prev.type)?.id ||
            "",
          walletId: prev.walletId || (wals as any)[0]?.id || "",
        }));
        setLoading(false);
      });
    }
  }, [isModalOpen]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createTransaction(fd);
    setLoading(false);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error),
      );
      return;
    }
    setIsModalOpen(false);
    setForm(emptyForm);
  }

  const openCreate = () => {
    setForm({
      ...emptyForm,
      categoryId: dbCategories.find((c) => c.type === "INCOME")?.id ?? "",
      walletId: dbWallets[0]?.id ?? "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return role === "ADMIN";
    if (item.memberOnly) return role === "MEMBER";
    return true;
  });

  const midIndex = Math.ceil(visibleItems.length / 2);
  const leftItems = visibleItems.slice(0, midIndex);
  const rightItems = visibleItems.slice(midIndex);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center z-10 py-0.5">
        {leftItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <div className="relative w-16 flex justify-center items-center">
          <button
            onClick={openCreate}
            className="absolute -translate-y-5 w-[76px] h-[76px] bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-transform active:scale-95 z-20 border-[6px] border-white"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m-7.5-7.5h15"
              />
            </svg>
          </button>
        </div>

        {rightItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {mounted && (
        <TransactionCreateModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          form={form}
          setForm={setForm}
          categories={dbCategories.filter(
            (cat) => cat.name !== "Target Sasaran",
          )}
          wallets={dbWallets}
          onSubmit={handleCreate}
          loading={loading}
          error={error}
        />
      )}
    </>
  );
}

function NavItem({ href, label, icon }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        `flex flex-col items-center justify-center flex-1 gap-1 p-2 rounded-lg transition-colors ${
          isActive ? "text-blue-500" : "text-zinc-500"
        }`,
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
