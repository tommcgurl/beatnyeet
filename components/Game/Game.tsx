import styles from './Game.module.css';

export type GameProps = {
  name: string;
  coverURL?: string;
  summary?: string;
}
const Game = ({name, coverURL, summary}: GameProps) => (
  <div className={styles.container}>
    <img alt={`${name}-cover`} src={coverURL}></img>
    <div className={styles.infoContainer}>
      <h3>{name}</h3>
      <p>{summary}</p>
    </div>
  </div>
)


export default Game