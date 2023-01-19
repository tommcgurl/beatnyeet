import { PrismaClient, Playthrough } from "@prisma/client";

type PlaythroughWithoutID = Omit<Playthrough, "id">;

const seedPlaythroughs = async (prisma: PrismaClient) => {
  const playthroughs: PlaythroughWithoutID[] = [
    {
      gameId: 1128,
      userId: 1,
      platformId: 7,
      review:
        "Amazing game. Lives up to the hype. I 186% it. Bosses were awesome. Movement and combat feels great. Love all the different weapons and abiilties. Playtime reported by game was 11 hours.",
      startDate: null,
      completionDate: null,
    },
    {
      gameId: 113112,
      userId: 4,
      platformId: 130,
      startDate: new Date("05/01/2021"),
      completionDate: new Date("07/14/2021"),
      review:
        "Hack and slash rogue-like with fast paced combat and procedeurally generated dungeon encounters. Each encounter leads to rewards that take your character build in different directions. A great mix of combat that is mindless but also deep/tactical, and a balance of RNG and thoughtfully approaching your build. I realize I may be biased towards this one and I don't think it's everyone's cup of tea, but I would call Hades an S tier video game and nearly a 10 for me. Cool story and great ancient Greek folklore flavor to boot",
    },
    {
      gameId: 1107,
      userId: 2,
      platformId: 24,
      review:
        "Great introduction to the metroid series. Way easier to get into than the original Metroid on NES. Challenging enough to require some exploration and experimentation without having to resort to walkthroughs. Save states help but you can avoid them for the most part (with the exception of maybe the final boss that's a bit annoying to get to without losing much health).",
      startDate: null,
      completionDate: null,
    },
    {
      gameId: 134582,
      userId: 3,
      platformId: 167,
      review:
        "Nothing to hate here - just some great Ratchet and Clank gameplay. Good platforming, combat and guns are fun, story is kinda funny. If I was 9 and this was all I had to play I'd love it even more.",
      startDate: null,
      completionDate: null,
    },
  ];
  let upsertedPlaythroughs = [];
  for (const playthrough of playthroughs) {
    const { gameId, userId, platformId } = playthrough;
    const upsertedPlaythrough = await prisma.playthrough.upsert({
      where: {
        gameId_userId_platformId: {
          gameId,
          userId,
          platformId,
        },
      },
      update: {},
      create: playthrough,
    });
    upsertedPlaythroughs.push(upsertedPlaythrough);
  }
  return upsertedPlaythroughs;
};

export default seedPlaythroughs;
