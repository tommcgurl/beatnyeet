import NextCrud, { PrismaAdapter } from "@premieroctet/next-crud";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
  const nextCrudHandler = await NextCrud({
    adapter: new PrismaAdapter({
      prismaClient,
    }),
    swagger: {
      title: "BeatNYeet",
      apiUrl: "http://localhost:3000/api"
    }
  });
  return nextCrudHandler(req, res);
};
export default handler;
