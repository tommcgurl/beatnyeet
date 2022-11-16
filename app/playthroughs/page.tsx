import { use } from "react";
import styles from "../page.module.css";
import { Playthrough, Game, User } from "@prisma/client";
type PlaythroughWithGameAndUser = Playthrough & {
  game: Game,
  user: User,
}

async function fetchPlaythroughData() {
  const playthroughs = await fetch("http://localhost:3000/api/playthroughs");
  return playthroughs.json();
}

export default function Playthroughs() {
  const playthroughs = use(fetchPlaythroughData());

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ul>
          {playthroughs.map((playthrough: PlaythroughWithGameAndUser) => {
            return (
              <li>
                <h1>Game name: {playthrough.game.name}</h1>
                <h2>Username: {playthrough.user.username}</h2>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
