import { use } from "react";
import Playthrough, { PlaythroughProps } from "../../components/playthrough";
import styles from './playthroughs.module.css';

async function fetchPlaythroughData() {
  const playthroughs = await fetch("http://localhost:3000/api/playthroughs?include=game,user");
  return playthroughs.json();
}

export default function Playthroughs() {
  const playthroughs: PlaythroughProps[] = use(fetchPlaythroughData());

  return (
    <div>
      <main>
        <h1>Playthroughs</h1>
        <ul className={styles.list}>
          {playthroughs.map((playthrough) => 
            <Playthrough {...playthrough}/>
          )}
        </ul>
      </main>
    </div>
  );
}
