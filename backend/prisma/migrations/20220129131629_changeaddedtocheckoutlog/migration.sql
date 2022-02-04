/*
  Warnings:

  - You are about to drop the column `createdDate` on the `LogisticChannel` table. All the data in the column will be lost.
  - You are about to drop the column `paymentChannel` on the `LogisticChannel` table. All the data in the column will be lost.
  - Added the required column `paymentChannel` to the `CheckOutLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckOutLog" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentChannel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LogisticChannel" DROP COLUMN "createdDate",
DROP COLUMN "paymentChannel";
