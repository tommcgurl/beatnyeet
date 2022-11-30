import { use } from "react";
import { Playthrough, Game, User } from "@prisma/client";
import styles from "./playthroughs.module.css";

type PlaythroughWithGameAndUser = Playthrough & {
  game: Game,
  user: User,
}

async function fetchPlaythroughData() {
  const playthroughs = await fetch("http://localhost:3000/api/playthroughs?include=game,user");
  return playthroughs.json();
}

export default function Playthroughs() {
  const playthroughs = use(fetchPlaythroughData());

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Playthroughs</h1>
        <ul className={styles.list}>
          {playthroughs.map((playthrough: PlaythroughWithGameAndUser) => {
            return (
              <li className={styles.card}>
                <span className={styles.nameContainer}><h1>{playthrough.game.name}</h1>({playthrough.platform})</span>
                <h2>User: {playthrough.user.username}</h2>
                <p>{playthrough.review}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
