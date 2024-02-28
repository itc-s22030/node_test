import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router()
const prisma = new PrismaClient();

const maxItemCount = 10;
router.get("/list", async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const skip = maxItemCount * (page - 1);

    try {
        const book = await prisma.books.findMany({
                skip,
                take: maxItemCount
            });
        res.status(200).json({books:book})
    }
    catch (error){
        res.status(400).json({message: "NG ",error:error})
    }
});


export default router;