import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const prisma = new PrismaClient().$extends(withAccelerate());

    if (req.method === "POST" && req.query.image === "true") {
        try {
            console.log("body>>>>>", req.body);
            const { themeId, data } = req.body;
            const images = await prisma.image.createMany({
                data: data.map((image: { url: string; imageId: string }) => {
                    return {
                        themeId: themeId,
                        url: image.url,
                        imageId: image.imageId,
                    };
                }),
            });
            return res.status(200).json(images);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
    if (req.method === "POST") {
        try {
            const theme = req.body;
            console.log(req.body);

            // Create a new organizer
            const newTheme = await prisma.theme.create({
                data: theme,
            });
            console.log("new", newTheme);

            // Return the created organizer
            return res.status(201).json(newTheme);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Failed to add Theme!" });
        }
    }
    if (req.method === "PUT") {
        try {
            const { themeId, ...rem } = req.body;

            // Fetch the existing organizer
            const existingTheme = await prisma.theme.findUnique({
                where: {
                    themeId: themeId,
                },
            });

            // Check if the organizer exists
            if (!existingTheme) {
                return res.status(404).json({ message: "Theme not found" });
            }

            // Extract the updated data from the request body

            // Update the organizer
            const updatedTheme = await prisma.theme.update({
                where: {
                    themeId: themeId,
                },
                data: rem,
            });

            // Return the updated organizer
            return res.status(200).json(updatedTheme);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
    if (req.method === "DELETE") {
        try {
            const themeId = req.query.id as string;
            const theme = await prisma.theme.delete({
                where: {
                    themeId: themeId,
                },
            });
            return res.status(200).json(theme);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
    try {
        // Extract the organizerId from the request query
        const themeId = req.query.themeId as string;

        // Check if organizerId is provided
        if (themeId) {
            // Fetch the organizer based on the provided organizerId
            const theme = await prisma.theme.findUnique({
                where: {
                    themeId: themeId,
                },
                select: {
                    image: { select: { url: true, imageId: true } },
                },
            });

            // Check if the organizer is found
            if (!theme) {
                return res.status(404).json({ message: "Theme not found" });
            }

            // Return the found organizer
            return res.status(200).json(theme);
        } else {
            // Fetch all organizers
            const themes = await prisma.theme.findMany({
                include: { image: { select: { url: true, imageId: true } } },
            });

            // Return the found organizers
            return res.status(200).json(themes);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}
