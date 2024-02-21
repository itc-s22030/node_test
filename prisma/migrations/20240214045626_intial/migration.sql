-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(256) NOT NULL,
    `name` VARCHAR(100) NULL,
    `password` TINYBLOB NOT NULL,
    `salt` TINYBLOB NOT NULL,
    `isAdmin` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Books` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `isbn13` INTEGER NOT NULL,
    `title` VARCHAR(200) NULL,
    `author` VARCHAR(100) NULL,
    `publishDate` DATE NOT NULL,

    UNIQUE INDEX `Books_isbn13_key`(`isbn13`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rental` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `bookId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `rentalDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDeadline` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDate` DATETIME(3) NOT NULL,
    `usersId` BIGINT NULL,
    `booksId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_booksId_fkey` FOREIGN KEY (`booksId`) REFERENCES `Books`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
