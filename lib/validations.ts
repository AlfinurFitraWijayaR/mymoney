import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi").max(50),
  password: z.string().min(1, "Password wajib diisi"),
});

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Hanya boleh huruf kecil, angka dan underscore"),
  password: z.string().min(3, "Password minimal 3 karakter"),
  tenantId: z
    .string()
    .min(3, "Tenant ID minimal 3 karakter")
    .max(50)
    .regex(/^[a-z0-9_]+$/, "Hanya boleh huruf kecil, angka dan underscore"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const ResetPasswordSchema = z.object({
  userId: z.string().uuid(),
  newPassword: z.string().min(3, "Password minimal 3 karakter"),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Name wajib diisi").max(100),
  type: z.enum(["INCOME", "EXPENSE"]),
  svg_code: z.string().min(1, "Icon wajib diisi"),
});

export const TransactionSchema = z.object({
  amount: z.coerce.number().positive("Jumlah harus positif"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().uuid("Category tidak valid"),
  walletId: z.string().uuid("Dompet tidak valid"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Tanggal wajib diisi"),
});

export const UpdateTransactionSchema = TransactionSchema.partial().extend({
  id: z.string().uuid(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;

export const GoalSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(100, "Judul maksimal 100 karakter"),
  target_amount: z.coerce
    .number()
    .positive("Target harus lebih dari 0")
    .min(1000, "Target minimal Rp 1.000"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  icon: z.string().min(1, "Ikon wajib dipilih"),
  deadline: z.string().min(1, "Tanggal target wajib diisi").refine(
    (val) => {
      const d = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    },
    { message: "Tanggal target tidak boleh di masa lalu" }
  ),
});

export const UpdateGoalBalanceSchema = z.object({
  id: z.string().uuid("ID goal tidak valid"),
  amount: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  type: z.enum(["setor", "tarik"]).default("setor"),
  walletId: z.string().uuid("Dompet tidak valid"),
});

export type GoalInput = z.infer<typeof GoalSchema>;
export type UpdateGoalBalanceInput = z.infer<typeof UpdateGoalBalanceSchema>;
