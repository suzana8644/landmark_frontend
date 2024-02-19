import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const prisma = new PrismaClient().$extends(withAccelerate());

        // Extract the organizerId from the request query
        const organizerId = req.query.organizerId as string;

        // Check if organizerId is provided
        if (!organizerId) {
            return res.status(400).json({ message: "organizerId parameter is required" });
        }

        // Fetch the organizer based on the provided organizerId
        const organizer = await prisma.organizer.findUnique({
            where: {
                organizerId: organizerId
            }
        });

        // Check if the organizer is found
        if (!organizer) {
            return res.status(404).json({ message: "Organizer not found" });
        }

        // Return the found organizer
        res.status(200).json(organizer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};
