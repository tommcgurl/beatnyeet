// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Game } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | string>
) {
  const { gameName } = req.query;
  const game = await prisma.game.findUnique({
    where: { name: gameName as string },
  });
  if (game) {
    res.status(200).json(game);
  } else {
    res.status(404).send("game not found");
  }
}
