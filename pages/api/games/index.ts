// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Game } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | Game[]>
) {
  switch (req.method) {
    case "POST":
      const { name } = req.body;
      const newGame = await prisma.game.create({ data: { name } });
      res.status(200).json(newGame);
      break;
    default:
      const games = await prisma.game.findMany();
      res.status(200).json(games);
      break;
  }
}
