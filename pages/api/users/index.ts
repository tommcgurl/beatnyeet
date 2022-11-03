// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | User[]>
) {
  switch (req.method) {
    case "POST":
      const { username } = req.body;
      const newUser = await prisma.user.create({ data: { username } });
      res.status(200).json(newUser);
      break;
    default:
      const users = await prisma.user.findMany();
      res.status(200).json(users);
      break;
  }
}
