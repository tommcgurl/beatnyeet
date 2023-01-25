"use client";

import styles from "../page.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PlaythroughInputs, submitPlaythrough } from "./submit-playthrough";
import SelectSearch from "react-select-search";
import { IGDBGame } from "../../pages/api/twitch-games";
import Game from "../../components/Game/Game";

async function searchGames(searchString: string) {
  if (!searchString) {
    return [];
  }
  const games = await fetch(
    `http://localhost:3000/api/twitch-games?name=${searchString}`
  );
  return games.json();
}

export default function AddPlaythrough() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<PlaythroughInputs>();
  //const onSubmit: SubmitHandler<Inputs>
  const onSubmit: SubmitHandler<PlaythroughInputs> = (inputs) => {
    return;
    submitPlaythrough(inputs);
    router.push("/playthroughs");
  };

  const renderGame = (
    domProps: any,
    option: any,
    _snapshot: any,
    className: any
  ) => {
    debugger;
    return (
      <button {...domProps} className={className}>
        <Game {...(option as IGDBGame)} />
      </button>
    );
  };

  const handleChange = (_selectedValue: any, selectedOption: any, _optionSnapshot: any) => {
    debugger;
    console.log(selectedOption);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Add Playthrough</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SelectSearch
            options={[]}
            onChange={handleChange}
            renderOption={renderGame}
            placeholder="Search Game"
            debounce={500}
            getOptions={searchGames}
            search
          />
          <input
            placeholder="User Name"
            type="text"
            {...register("userName")}
          ></input>
          <input
            placeholder="Platform"
            type="text"
            {...register("platform")}
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
          <button type="submit">Add</button>
        </form>
      </main>
    </div>
  );
}
