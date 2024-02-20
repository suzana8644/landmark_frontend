import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const prisma = new PrismaClient().$extends(withAccelerate());

    if (req.method === "POST") {
        try {
            const organizer = req.body;
            console.log(req.body);

            // Create a new organizer
            const newOrganizer = await prisma.organizer.create({
                data: organizer,
            });
            console.log("new", newOrganizer);

            // Return the created organizer
            return res.status(201).json(newOrganizer);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "Failed to add organizer!" });
        }
    }
    if (req.method === "PUT") {
        try {
            const {organizerId, ...rem}  = req.body;

            // Fetch the existing organizer
            const existingOrganizer = await prisma.organizer.findUnique({
                where: {
                    organizerId: organizerId,
                },
            });

            // Check if the organizer exists
            if (!existingOrganizer) {
                return res.status(404).json({ message: "Organizer not found" });
            }

            // Extract the updated data from the request body

            // Update the organizer
            const updatedOrganizer = await prisma.organizer.update({
                where: {
                    organizerId: organizerId,
                },
                data: rem,
            });

            // Return the updated organizer
            return res.status(200).json(updatedOrganizer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
    if (req.method === "DELETE") {
        try {
            const organizerId = req.query.id as string;
            const organizer = await prisma.organizer.delete({
                where: {
                    organizerId: organizerId,
                },
            });
            return res.status(200).json(organizer);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
    try {
        // Extract the organizerId from the request query
        const organizerId = req.query.organizerId as string;

        // Check if organizerId is provided
        if (organizerId) {
            // Fetch the organizer based on the provided organizerId
            const organizer = await prisma.organizer.findUnique({
                where: {
                    organizerId: organizerId,
                },
            });

            // Check if the organizer is found
            if (!organizer) {
                return res.status(404).json({ message: "Organizer not found" });
            }

            // Return the found organizer
            return res.status(200).json(organizer);
        } else {
            // Fetch all organizers
            const organizers = await prisma.organizer.findMany();

            // Return the found organizers
            return res.status(200).json(organizers);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}
