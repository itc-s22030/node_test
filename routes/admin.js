import express from "express";
import {check, validationResult} from "express-validator";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.use((req, res, next) => {
    if (!req.user) {
        // 未ログイン
        res.status(401).json({message: "not login"})
        return
    }
    if(!req.user.isAdmin){
        res.status(401).json({message: "not admin"})
        return;
    }
    // 問題なければ次へ
    next();
});

router.post("/book/create", [
    check("isbn13").notEmpty({ignore_whitespace: true}),
    check("title").notEmpty({ignore_whitespace: true}),
    check("author").notEmpty({ignore_whitespace: true}),
    check("publishDate").notEmpty({ignore_whitespace: true})
], async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        // データが足りないのでエラー
        res.status(400).json({message: "error"});
        return;
    }
    try {
        const {isbn13, title, author, publishDate} = req.body;
        await prisma.books.create({
            data: {
                isbn13,
                title,
                author,
                publishDate,
            }
        });
        res.status(201).json({message: "created"});
    } catch (error) {
        res.status(400).json({message: "NG ",error:error}
        );
    }
});

export default router;
