"use client";

import styles from "../page.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PlaythroughInputs, submitPlaythrough } from "./submit-playthrough";
import SelectSearch from "react-select-search";
import { IGDBGame } from "../../pages/api/twitch-games";
import Game from "../../components/Game/Game";
import { useState } from "react";

async function searchGames(searchString: string) {
  if (!searchString) {
    return [];
  }
  const gamesResponse = await fetch(
    `http://localhost:3000/api/twitch-games?name=${searchString}`
  );
  const games = await gamesResponse.json();
  return games.map((game: IGDBGame) => ({...game, value: game.id}))
}

export default function AddPlaythrough() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<IGDBGame | null>(null);
  const { register, handleSubmit, setValue } = useForm<PlaythroughInputs>();
  //const onSubmit: SubmitHandler<Inputs>
  const onSubmit: SubmitHandler<PlaythroughInputs> = (inputs) => {
    submitPlaythrough(inputs);
    router.push("/playthroughs");
  };

  const renderGame = (
    domProps: any,
    option: any,
    _snapshot: any,
    className: any
  ) => {
    return (
      <button key={option.id} {...domProps} className={className}>
        <Game {...(option as IGDBGame)} />
      </button>
    );
  };

  const handleChange = (
    _selectedValue: any,
    selectedOption: any,
    _optionSnapshot: any
  ) => {
    const { id, platforms } = selectedOption;
    console.log(selectedOption);
    setSelectedGame(selectedOption);
    setValue("gameId", id);
    setValue("platformId", platforms[0].id);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Add Playthrough</h1>
        {!selectedGame && (
          <SelectSearch
            options={[]}
            onChange={handleChange}
            renderOption={renderGame}
            placeholder="Search Game"
            debounce={500}
            getOptions={searchGames}
            search
            fuzzySearch={false}
          />
        )}
        {selectedGame && <Game {...selectedGame} />}
        <input
          placeholder="User Name"
          type="text"
          {...register("userName")}
        ></input>
        <input
          placeholder="Start Date"
          type="date"
          {...register("startDate")}
        ></input>
        <input
          placeholder="Completed Date"
          type="date"
          {...register("completionDate")}
        ></input>
        <textarea placeholder="Review" {...register("review")}></textarea>
        <button onClick={handleSubmit(onSubmit)}>Add</button>
      </main>
    </div>
  );
}
