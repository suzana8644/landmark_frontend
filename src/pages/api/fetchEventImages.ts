import { NextApiRequest, NextApiResponse } from "next";
import { EventImage, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const prisma = new PrismaClient().$extends(withAccelerate());
    const eventCategoryId = req.query.eventCategoryId as string; // Update to eventCategoryId
    if (eventCategoryId) {
      // Fetch images by eventCategoryId
      const images: EventImage[] = await prisma.eventImage.findMany({
        where: {
          eventCategoryId: eventCategoryId,
        },
      });
      res.status(200).json(images);
    } else {
      const images: EventImage[] = await prisma.eventImage.findMany();
      res.status(200).json(images);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
