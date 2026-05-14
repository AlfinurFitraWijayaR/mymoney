"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function getWallets() {
  const session = await requireAuth();
  const wallets = await prisma.wallet.findMany({
    where: { tenant_id: session.tenantId },
    orderBy: { created_at: "asc" },
  });

  return wallets.map((w) => ({
    ...w,
    balance: Number(w.balance),
    created_at: w.created_at.toISOString(),
    updated_at: w.updated_at.toISOString(),
  }));
}

export async function setupWalletAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const name = formData.get("name") as string;
    const type = formData.get("type") as any;
    const amount = Number(formData.get("amount"));

    if (isNaN(amount) || amount < 0) {
      return { error: "Jumlah tidak valid" };
    }

    const existing = await prisma.wallet.findUnique({
      where: {
        name_tenant_id: {
          name,
          tenant_id: session.tenantId,
        },
      },
    });

    if (existing && Number(existing.balance) > 0) {
      return { error: "Saldo awal sudah diatur dan tidak bisa diubah" };
    }

    if (existing) {
      await prisma.wallet.update({
        where: { id: existing.id },
        data: { balance: amount },
      });
    } else {
      await prisma.wallet.create({
        data: {
          name,
          type,
          balance: amount,
          tenant_id: session.tenantId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Setup wallet error:", error);
    return { error: "Gagal mengatur saldo awal" };
  }
}
