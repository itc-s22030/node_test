const express = require("express");
const {PrismaClient} = require("@prisma/client")
const {data} = require("express-session/session/cookie");
const {raw} = require("@prisma/client/runtime/binary");

const router = express.Router();
const prisma = new PrismaClient();

const isAuthenticated = (req, res, next) => {
    const isLoggedIn = req.isAuthenticated();

    if (isLoggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'not login' });
    }
};

// 書籍貸出
router.post("/start",isAuthenticated, async (req, res, next) => {
    try {
        const {bookId} = req.body;

        // すでに貸出中の場合はエラーを返す
        const exitRental = await prisma.rental.findFirst({
            where: {
                bookId: bookId,
                returnDate: null
            }
        });
        if (exitRental) {
            return res.status(409).json({message: "Currently on loan"});
        }
        const newRental = await prisma.rental.create({
            data: {
                bookId: bookId,
                userId: req.user.id,
                rentalDate: new Date(),
                returnDeadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.status(200).json({
            id: newRental.id,
            bookId: newRental.bookId,
            rentalDate: newRental.rentalDate,
            returnDeadline: newRental.returnDeadline
        });
    } catch (e) {
        res.status(400).json({message: "Unexpected error"})
        console.log(e)
    }
});

// 書籍返却
router.put("/return", isAuthenticated, async (req, res, next) => {
    try {
        const {rentalId} = req.body;

        const rental = await prisma.rental.findUnique({
            where: {
                id: rentalId
            }
        });
        if (!rental) {
            return res.status(400).json({message: "NG"});
        }
        const returnedRental = await prisma.rental.update({
            where: {
                id: rentalId
            },
            data: {
                returnDate: new Date()
            }
        });
        res.status(200).json({message: "OK"});
    } catch (e) {
        res.status(400).json({message: "rental error"});
        console.log(e);
    }
});
// 借用書籍一覧
router.get("/current", isAuthenticated, async (req, res, next) => {
    try {
        const {userId} = req.body

        const BooksList = await prisma.rental.findMany({
            where: {
                userId: userId,
                returnDate: null,
            },
            select: {
                id: true,
                bookId: true,
                rentalDate: true,
                returnDeadline: true,
                books: {
                    select: {
                        title: true
                    }
                }
            }
        });
        const  rentalBooks = BooksList.map(rental => ({
            rentalId: rental.id,
            bookId: rental.bookId,
            bookName: rental.books.title,
            rentalDate: rental.rentalDate,
            returnDeadline: rental.returnDeadline
        }));
        res.status(200).json({rentalBooks});
    } catch (e) {
        res.status(500).json({message: "not get list"});
        console.log(e);
    }
});

// 借用書籍履歴
router.get("/history", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.body;

        const RentalCertificate = await prisma.rental.findMany({
            where: {
                userId: userId,
                returnDate: {not: null}
            },
            select: {
                id: true,
                bookId: true,
                rentalDate: true,
                returnDate: true,
                books: {
                    select: {
                        title: true
                    }
                },
            }
        });
        const  rentalHistory = RentalCertificate.map(rental => ({
            rentalId: rental.id,
            bookId: rental.bookId,
            bookName: rental.books.title,
            rentalDate: rental.rentalDate,
            returnDate: rental.returnDate
        }));
        res.status(200).json({rentalHistory});
    } catch (e) {
        res.status(500).json({message: "not get list"});
        console.log(e);
    }
});

module.exports = router;