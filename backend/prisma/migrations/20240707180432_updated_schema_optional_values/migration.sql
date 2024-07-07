/*
  Warnings:

  - Added the required column `password` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "password" TEXT NOT NULL;
