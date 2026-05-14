// lib/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { login, destroySession, requireAuth } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const raw = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const result = await login(parsed.data.username, parsed.data.password);

  if (result.error) {
    return { error: result.error };
  }

  redirect(result.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function getSessionAction() {
  return requireAuth();
}

export async function changePasswordAction(formData: FormData) {
  const session = await getSessionAction();
  if (!session) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Password konfirmasi tidak cocok" };
  }

  if (newPassword.length <= 3) {
    return { error: "Password minimal 3 karakter" };
  }

  const bcrypt = await import("bcryptjs");
  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) return { error: "User tidak ditemukan" };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Password lama salah" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}
