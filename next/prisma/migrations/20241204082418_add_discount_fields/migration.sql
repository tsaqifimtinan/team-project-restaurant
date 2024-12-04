-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `discountAmount` DOUBLE NULL,
    ADD COLUMN `promoCode` VARCHAR(191) NULL;
