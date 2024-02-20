import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const prisma = new PrismaClient().$extends(withAccelerate());

    if (req.method === "PUT") {
      // Extract the organizerId from the request query
      const organizerId = req.query.organizerId as string;

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
      const { newData } = req.body;

      // Update the organizer
      const updatedOrganizer = await prisma.organizer.update({
        where: {
          organizerId: organizerId,
        },
        data: newData,
      });

      // Return the updated organizer
      return res.status(200).json(updatedOrganizer);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
