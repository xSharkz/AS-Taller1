/*
  Warnings:

  - Added the required column `action` to the `AuthLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthLog" ADD COLUMN     "action" TEXT NOT NULL;
