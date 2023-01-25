import { Playthrough as PlaythroughType, User } from "@prisma/client";
import { use } from "react";
import Playthrough, { PlaythroughProps } from "../../components/Playthrough/Playthrough";
import { IGDBGame } from "../../pages/api/twitch-games";
import styles from './playthroughs.module.css';


type PlaythroughWithUser = {
  user: User
} & PlaythroughType

type GamesMap = {
  [key: string]: IGDBGame
}

async function fetchAllGamesForPlaythroughs(playthroughs: PlaythroughWithUser[]) {
  const baseURL = 'http://localhost:3000/api/twitch-games';
  const gameIDs = playthroughs.map(playthrough => playthrough.gameId).join(',');
  const response = await fetch(`${baseURL}/${gameIDs}`)
  return response.json();
}

async function fetchPlaythroughs() {
  const playthroughs = await fetch("http://localhost:3000/api/playthroughs?include=user");
  return playthroughs.json();
}


// TODO: Move this complexity to the API. We will have to overwrite the default handler
// for /playthroughs.
async function fetchPlaythroughsData() {
  const playthroughs: PlaythroughWithUser[] = await fetchPlaythroughs();
  const gamesforPlaythroughs: IGDBGame[] = await fetchAllGamesForPlaythroughs(playthroughs);
  const gamesMap: GamesMap = gamesforPlaythroughs.reduce((acc, currGame) => (
    {
      ...acc,
      [currGame.id]: currGame
    }
  ), {})
  const playthroughProps = playthroughs.map(playthrough => (
    {
      ...playthrough,
      game: gamesMap[playthrough.gameId]
    }
  ));
  return playthroughProps;
}

export default function Playthroughs() {
  const playthroughs: PlaythroughProps[] = use(fetchPlaythroughsData());

  return (
    <div>
      <main>
        <h1>Playthroughs</h1>
        <ul className={styles.list}>
          {playthroughs.map((playthrough) => 
            <Playthrough key={playthrough.id} {...playthrough}/>
          )}
        </ul>
      </main>
    </div>
  );
}
