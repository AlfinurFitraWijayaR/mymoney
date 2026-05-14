"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserAlias(alias: string) {
  try {
    const session = await requireAuth();
    
    await prisma.user.update({
      where: { id: session.userId },
      data: { alias }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update alias:", error);
    return { success: false, error: "Gagal memperbarui nama alias" };
  }
}
