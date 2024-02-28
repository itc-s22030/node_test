/*
  Warnings:

  - You are about to drop the column `booksId` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Rental` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Rental` DROP FOREIGN KEY `Rental_booksId_fkey`;

-- DropForeignKey
ALTER TABLE `Rental` DROP FOREIGN KEY `Rental_usersId_fkey`;

-- AlterTable
ALTER TABLE `Rental` DROP COLUMN `booksId`,
    DROP COLUMN `usersId`;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
