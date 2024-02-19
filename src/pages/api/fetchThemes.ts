import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check if the request includes a specific themeId
        const themeId = req.query.themeId as string;
        if (themeId) {
            // Fetch the theme by themeId
            const theme = await prisma.theme.findUnique({
                where: {
                    themeId: themeId
                }
            });
            if (!theme) {
                return res.status(404).json({ message: "Theme not found" });
            }
            return res.status(200).json(theme);
        } else {
            // Check if the request includes a specific eventCategoryId
            const eventCategoryId = req.query.eventCategoryId as string;
            if (eventCategoryId) {
                // Fetch themes by eventCategoryId
                const themes = await prisma.theme.findMany({
                    where: {
                        eventCategoryId: eventCategoryId
                    }
                });
                return res.status(200).json(themes);
            } else {
                // Fetch all themes
                const themes = await prisma.theme.findMany();
                return res.status(200).json(themes);
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};
