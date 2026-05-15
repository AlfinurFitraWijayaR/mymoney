"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CategorySchema } from "@/lib/validations";

export async function getCategories() {
  // Use Prisma findMany with tenant_id filter instead of raw SQL that fetches ALL tenants
  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return categories;
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
