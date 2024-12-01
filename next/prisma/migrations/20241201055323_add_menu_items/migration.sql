/*
  Warnings:

  - You are about to alter the column `price` on the `menuitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `menuitem` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;
