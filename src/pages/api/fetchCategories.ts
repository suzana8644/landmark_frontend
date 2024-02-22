import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const prisma = new PrismaClient().$extends(withAccelerate());
  if (req.method === "POST" && req.query.image === "true") {
    try {
      console.log("body>>>>>", req.body);
      const { eventCategoryId, data } = req.body;
      const images = await prisma.eventImage.createMany({
        data: data.map((image: { url: string; imageId: string }) => {
          return {
            eventCategoryId: eventCategoryId,
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
      const eventCategory = req.body;
      console.log(req.body);

      // Create a new organizer
      const newEventCategory = await prisma.eventCategory.create({
        data: eventCategory,
      });
      console.log("new", newEventCategory);

      // Return the created category
      return res.status(201).json(newEventCategory);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to add Category!" });
    }
  }
  if (req.method === "PUT") {
    try {
      const { eventCategoryId, ...rem } = req.body;

      // Fetch the existing organizer
      const existingEventCategory = await prisma.eventCategory.findUnique({
        where: {
          eventCategoryId: eventCategoryId,
        },
      });

      // Check if the organizer exists
      if (!existingEventCategory) {
        return res.status(404).json({ message: "Event Category not found" });
      }

      // Extract the updated data from the request body

      // Update the organizer
      const updatedEventCategory = await prisma.eventCategory.update({
        where: {
          eventCategoryId: eventCategoryId,
        },
        data: rem,
      });

      // Return the updated organizer
      return res.status(200).json(updatedEventCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }
  if (req.method === "DELETE") {
    try {
      const eventCategoryId = req.query.id as string;
      const eventCategory = await prisma.eventCategory.delete({
        where: {
          eventCategoryId: eventCategoryId,
        },
      });
      return res.status(200).json(eventCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }
  try {
    // Extract the eventCategoryId from the request query
    const eventCategoryId = req.query.eventCategoryId as string;

    // Check if eventCategoryId is provided
    if (eventCategoryId) {
      // Fetch the organizer based on the provided organizerId
      const eventCategory = await prisma.eventCategory.findUnique({
        where: {
          eventCategoryId: eventCategoryId,
        },
      });

      // Check if the organizer is found
      if (!eventCategory) {
        return res.status(404).json({ message: "Event Category not found" });
      }

      // Return the found organizer
      return res.status(200).json(eventCategory);
    } else {
      // Fetch all organizers
      const eventCategories = await prisma.eventCategory.findMany();

      // Return the found organizers
      return res.status(200).json(eventCategories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
