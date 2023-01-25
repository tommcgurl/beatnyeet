import { Playthrough as PlaythroughType, User } from "@prisma/client";
import { IGDBGame } from "../../pages/api/twitch-games";
import Game from "../Game/Game";
import styles from './Playthrough.module.css';

export type PlaythroughProps = PlaythroughType & {
  user: User,
  game: IGDBGame
}

const Playthrough = ({startDate, completionDate, user, review, game}: PlaythroughProps) => {
  const formattedStartDate = startDate && new Date(startDate).toLocaleDateString();
  const formattedCompletionDate = completionDate && new Date(completionDate).toLocaleDateString();
  const formattedPlatforms = game.platforms?.map(platform => platform.name).join(', ');
  return (
    <li className={styles.card}>
      <Game {...game}/>
      {/* <span className={styles.nameContainer}><h1>{game.name}</h1>({formattedPlatforms})</span> */}
      <h2>User: {user.username}</h2>
      {formattedStartDate && (
        <p>Started on: {formattedStartDate}</p>
      )}
      {formattedCompletionDate && (
        <p>Completed on: {formattedCompletionDate}</p>
      )}
      <p>{review}</p>
    </li>
  );
} 
export default Playthrough