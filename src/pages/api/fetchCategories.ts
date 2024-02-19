import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const prisma = new PrismaClient().$extends(withAccelerate());

        // Check if the request includes a specific themeId
        const eventCategoryId = req.query.eventCategoryId as string;
        if (eventCategoryId) {
            // Fetch the theme by themeId
            const eventCategory = await prisma.eventCategory.findUnique({
                where: {
                    eventCategoryId: eventCategoryId
                }
            });
            if (!eventCategory) {
                return res.status(404).json({ message: "Event Category not found" });
            }
            return res.status(200).json(eventCategory);
        } else {
            // Fetch all themes
            const eventCategories = await prisma.eventCategory.findMany();
            return res.status(200).json(eventCategories);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};
