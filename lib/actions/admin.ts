"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CreateUserSchema, ResetPasswordSchema } from "@/lib/validations";

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers, memberCount, adminCount, txCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.transaction.count(),
  ]);

  return { totalUsers, memberCount, adminCount, txCount };
}

export async function getAllUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      tenant_id: true,
      created_at: true,
    },
    orderBy: { created_at: "desc" },
  });
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const raw = {
    username: formData.get("username"),
    password: formData.get("password"),
    tenantId: formData.get("tenantId"),
    role: formData.get("role") || "MEMBER",
  };

  const parsed = CreateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const exists = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (exists) return { error: "Username already taken" };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      username: parsed.data.username,
      password: hashedPassword,
      tenant_id: parsed.data.tenantId,
      role: parsed.data.role,
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (session.userId === userId) {
    return { error: "You cannot delete your own account" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found" };

  // Cascade: delete transactions and categories for this tenant
  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { tenant_id: user.tenant_id } }),
    prisma.category.deleteMany({ where: { tenant_id: user.tenant_id } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  await requireAdmin();

  const parsed = ResetPasswordSchema.safeParse({
    userId: formData.get("userId"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { password: hashed },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
