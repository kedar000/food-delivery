/*
  Warnings:

  - You are about to drop the `ItemsOrdered` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item` to the `Refund` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemsOrdered" DROP CONSTRAINT "ItemsOrdered_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ItemsOrdered" DROP CONSTRAINT "ItemsOrdered_refundId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "items" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN     "item" JSONB NOT NULL;

-- DropTable
DROP TABLE "ItemsOrdered";
