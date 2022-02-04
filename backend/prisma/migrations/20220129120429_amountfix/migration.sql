/*
  Warnings:

  - You are about to alter the column `amount` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
