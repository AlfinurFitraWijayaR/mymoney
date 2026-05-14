// types/index.ts
export type { Role, TransactionType } from "@prisma/client";

export interface SessionUser {
  userId: string;
  username: string;
  role: "ADMIN" | "MEMBER";
  tenantId: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string | Record<string, string[]>;
  success?: boolean;
}
