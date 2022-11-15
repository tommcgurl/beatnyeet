import { PrismaClient } from "@prisma/client";
const seedUsers = async (prisma: PrismaClient) => {
  const users =[
    "tommmcgurl",
    "mattclawson",
    "noahberman",
    "willpurcell"
  ]
  let upsertedUsers = []
  for (const username of users) {
    const upsertedUser = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
      },
    });
    upsertedUsers.push(upsertedUser)
  }
  return upsertedUsers;
}

export default seedUsers