// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Playthrough } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Playthrough | Playthrough[]>
) {
  switch (req.method) {
    case "POST":
      const { userId, gameId } = req.body;
      const newPlaythrough = await prisma.playthrough.create({
        data: {
          userId,
          gameId,
        },
        include: {
          user: true,
          game: true
        },
      });
      res.status(200).json(newPlaythrough);
      break;
    default:
      const playthroughs = await prisma.playthrough.findMany({
        include: {
          user: true,
          game: true
        }
      });
      res.status(200).json(playthroughs);
      break;
  }
}
