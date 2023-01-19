import { PrismaClient } from "@prisma/client";
import seedUsers from "./seed-scripts/seed-users";
// import seedGames from "./seed-scripts/seed-games";
import seedPlaythroughs from "./seed-scripts/seed-playthroughs";

const prisma = new PrismaClient();
async function main() {
  const seededUsers = await seedUsers(prisma);
  // const seededGames = await seedGames(prisma);
  const seededPlaythroughs = await seedPlaythroughs(prisma);
  // Promise.all(see)v
  console.log(seededUsers);
  // console.log(seededGames)
  console.log(seededPlaythroughs);
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
