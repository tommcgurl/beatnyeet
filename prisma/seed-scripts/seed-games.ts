import { PrismaClient } from "@prisma/client";

const seedGames = async (prisma: PrismaClient) => {
  const games = [
    "Hades",
    "Castlevania: Symphony of the Night",
    "Metroid: Zero Mission",
    "Rachet & Clank: A Rift Apart",
  ];
  let upsertedGames = [];
  // Must use for in to do them in sequence so
  // as not to lock up the client.
  for (const name of games) {
    const upsertedGame = await prisma.game.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
    upsertedGames.push(upsertedGame);
  }
  return upsertedGames;
};

export default seedGames;
