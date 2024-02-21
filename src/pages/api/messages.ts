import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Message } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    // Fetch all messages
    try {
      const messages: Message[] = await prisma.message.findMany();
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Error fetching messages" });
    }
  } else if (req.method === "POST") {
    // Upload a message
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    try {
      const newMessage = await prisma.message.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          message,
        },
      });
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error uploading message:", error);
      res.status(500).json({ error: "Error uploading message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
