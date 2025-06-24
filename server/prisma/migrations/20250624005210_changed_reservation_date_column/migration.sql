/*
  Warnings:

  - You are about to drop the column `created_at` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_date` on the `reservations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "created_at",
DROP COLUMN "reservation_date",
ADD COLUMN     "reserved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
