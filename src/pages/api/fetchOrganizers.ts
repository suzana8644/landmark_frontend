import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const prisma = new PrismaClient().$extends(withAccelerate());

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
