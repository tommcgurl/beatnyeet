import styles from './Game.module.css';
import { IGDBGame } from '../../pages/api/twitch-games';


const Game = ({name, cover, summary, platforms}: IGDBGame) => (
  <div className={styles.container}>
    <img alt={`${name}-cover`} src={cover?.url}></img>
    <div className={styles.infoContainer}>
      <h3>{name}</h3>
      <p>{summary}</p>
    </div>
  </div>
)


export default Game