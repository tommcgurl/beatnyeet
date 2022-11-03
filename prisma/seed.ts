import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const tom = await prisma.user.upsert({
    where: { username: "tommcgurl" },
    update: {},
    create: {
      username: "tommcgurl",
    },
  });
  const matt = await prisma.user.upsert({
    where: { username: "mattclawson" },
    update: {},
    create: {
      username: "mattclawson",
    },
  });
  const noah = await prisma.user.upsert({
    where: { username: "noahberman" },
    update: {},
    create: {
      username: "noahberman",
    },
  });
  const will = await prisma.user.upsert({
    where: { username: "whereiswill?" },
    update: {},
    create: {
      username: "whereiswill",
    },
  });
  console.log({ tom, matt, noah, will });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
