/*
  Warnings:

  - You are about to alter the column `isbn13` on the `Books` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(13,0)`.

*/
-- AlterTable
ALTER TABLE `Books` MODIFY `isbn13` DECIMAL(13, 0) NOT NULL;
