import { NextApiRequest, NextApiResponse } from "next";
import { ThemeImage, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const prisma = new PrismaClient().$extends(withAccelerate());
    const themeId = req.query.themeId as string;

    // Fetch images by themeId
    const images: ThemeImage[] = await prisma.themeImage.findMany({
      where: {
        themeId: themeId,
      },
    });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}
