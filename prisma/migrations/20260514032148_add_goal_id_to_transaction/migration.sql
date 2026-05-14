/*
  Warnings:

  - A unique constraint covering the columns `[name,type,tenant_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `svg_code` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('CASH', 'BANK', 'EWALLET');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "categories_name_tenant_id_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "svg_code" TEXT NOT NULL,
ADD COLUMN     "type" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "goal_id" TEXT,
ADD COLUMN     "wallet_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "alias" TEXT;

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "type" "WalletType" NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target_amount" DOUBLE PRECISION NOT NULL,
    "current_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'general',
    "icon" TEXT NOT NULL DEFAULT '🎯',
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wallets_tenant_id_idx" ON "wallets"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_name_tenant_id_key" ON "wallets"("name", "tenant_id");

-- CreateIndex
CREATE INDEX "financial_goals_tenant_id_idx" ON "financial_goals"("tenant_id");

-- CreateIndex
CREATE INDEX "financial_goals_tenant_id_status_idx" ON "financial_goals"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_type_tenant_id_key" ON "categories"("name", "type", "tenant_id");

-- CreateIndex
CREATE INDEX "transactions_wallet_id_idx" ON "transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "transactions_goal_id_idx" ON "transactions"("goal_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "financial_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
