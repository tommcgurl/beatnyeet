import { Playthrough as PlaythroughType, Game, User } from "@prisma/client";
import styles from './playthrough.module.css';

export type PlaythroughProps = PlaythroughType & {
  game: Game,
  user: User,
}

const Playthrough = ({startDate, completionDate, ...playthrough}: PlaythroughProps) => {
  const formattedStartDate = startDate && new Date(startDate).toLocaleDateString();
  const formattedCompletionDate = completionDate && new Date(completionDate).toLocaleDateString();
  return (
    <li className={styles.card}>
      <span className={styles.nameContainer}><h1>{playthrough.game.name}</h1>({playthrough.platform})</span>
      <h2>User: {playthrough.user.username}</h2>
      {formattedStartDate && (
        <p>Started on: {formattedStartDate}</p>
      )}
      {formattedCompletionDate && (
        <p>Completed on: {formattedCompletionDate}</p>
      )}
      <p>{playthrough.review}</p>
    </li>
  );
} 
export default Playthrough