import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'

export default async function handler(req: any, res: NextApiResponse) {
    try {
        const prisma = new PrismaClient().$extends(withAccelerate());
        const theme = await prisma.theme.findMany();
        res.status(200).json(theme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};
