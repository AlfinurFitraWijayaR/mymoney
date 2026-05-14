"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CategorySchema } from "@/lib/validations";
import { Category } from "@prisma/client";

export async function getCategories() {
  return prisma.$queryRaw<Category[]>`
    SELECT *
    FROM "categories"
    ORDER BY 
      "type" ASC,
      CASE 
        -- INCOME
        WHEN "type" = 'INCOME' AND "name" = 'Uang saku' THEN 1
        WHEN "type" = 'INCOME' AND "name" = 'Gaji' THEN 2
        WHEN "type" = 'INCOME' AND "name" = 'Bonus' THEN 3

        -- EXPENSE
        WHEN "type" = 'EXPENSE' AND "name" = 'Jajan' THEN 1
        WHEN "type" = 'EXPENSE' AND "name" = 'Belanja' THEN 2
        WHEN "type" = 'EXPENSE' AND "name" = 'Transport' THEN 3
        WHEN "type" = 'EXPENSE' AND "name" = 'Tagihan' THEN 4
        WHEN "type" = 'EXPENSE' AND "name" = 'Cicilan' THEN 5
        WHEN "type" = 'EXPENSE' AND "name" = 'Hiburan' THEN 6
        WHEN "type" = 'EXPENSE' AND "name" = 'Sosial' THEN 7
        WHEN "type" = 'EXPENSE' AND "name" = 'Kesehatan' THEN 8

        -- GLOBAL LAST
        WHEN "name" = 'Lainnya' THEN 999

        ELSE 50
      END;
  `;
}

export async function createCategory(formData: FormData) {
  try {
    const session = await requireAdmin();

    const parsed = CategorySchema.safeParse({
      name: formData.get("name"),
      type: formData.get("type"),
      svg_code: formData.get("svg_code"),
    });

    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const exists = await prisma.category.findUnique({
      where: {
        name_type_tenant_id: {
          name: parsed.data.name,
          type: parsed.data.type,
          tenant_id: session.tenantId,
        },
      },
    });

    if (exists) return { error: "Kategori sudah ada" };

    await prisma.category.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        svg_code: parsed.data.svg_code,
        tenant_id: session.tenantId,
      },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    if (error.message === "FORBIDDEN")
      return { error: "Hanya Admin yang dapat melakukan ini" };
    return { error: "Terjadi kesalahan saat membuat kategori" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const session = await requireAdmin();

    const parsed = CategorySchema.safeParse({
      name: formData.get("name"),
      type: formData.get("type"),
      svg_code: formData.get("svg_code"),
    });

    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const existing = await prisma.category.findFirst({
      where: { id, tenant_id: session.tenantId },
    });

    if (!existing) return { error: "Category not found" };

    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        svg_code: parsed.data.svg_code,
      },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    if (error.message === "FORBIDDEN")
      return { error: "Hanya Admin yang dapat melakukan ini" };
    return { error: "Terjadi kesalahan saat memperbarui kategori" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await requireAdmin();

    const existing = await prisma.category.findFirst({
      where: { id, tenant_id: session.tenantId },
    });

    if (!existing) return { error: "Category not found" };

    // Check if used by transactions
    const count = await prisma.transaction.count({
      where: { category_id: id, tenant_id: session.tenantId },
    });

    if (count > 0) {
      return {
        error: `Tidak dapat menghapus: ${count} transaksi menggunakan kategori ini`,
      };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/categories");
    return { success: true };
  } catch (error: any) {
    if (error.message === "FORBIDDEN")
      return { error: "Hanya Admin yang dapat melakukan ini" };
    return { error: "Terjadi kesalahan saat menghapus kategori" };
  }
}
