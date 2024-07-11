/*
  Warnings:

  - The values [Veg,NonVeg] on the enum `ItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemType_new" AS ENUM ('VEG', 'NONVEG');
ALTER TABLE "Menu" ALTER COLUMN "type" TYPE "ItemType_new" USING ("type"::text::"ItemType_new");
ALTER TYPE "ItemType" RENAME TO "ItemType_old";
ALTER TYPE "ItemType_new" RENAME TO "ItemType";
DROP TYPE "ItemType_old";
COMMIT;

-- AlterTable
ALTER TABLE "DeliveryPartner" ADD COLUMN     "itemstatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "orderstatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderstatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prepStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "orderprepstatus" BOOLEAN NOT NULL DEFAULT false;
