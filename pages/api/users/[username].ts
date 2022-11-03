// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | string>
) {
  const { username } = req.query;
  const user = await prisma.user.findUnique({
    where: { username: username as string },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("user not found");
  }
}
