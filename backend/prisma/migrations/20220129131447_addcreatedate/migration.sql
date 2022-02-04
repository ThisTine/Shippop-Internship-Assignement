/*
  Warnings:

  - Added the required column `paymentChannel` to the `LogisticChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogisticChannel" ADD COLUMN     "paymentChannel" TEXT NOT NULL;
