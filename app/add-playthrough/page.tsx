'use client'

import styles from '../page.module.css';
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  gameName: string,
  userName: string,
  platform: string,
  startDate: Date,
  completedOn: Date | null,
  review: string
}

export default function AddPlaythrough() {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Add Playthrough</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Game Name" type="text" {...register("gameName")}></input>
          <input placeholder="User Name" type="text" {...register("userName")}></input>
          <input placeholder="Platform" type="text" {...register("platform")}></input>
          <input placeholder="Start Date" type="date" {...register("startDate")}></input>
          <input placeholder="Completed Date" type="date" {...register("completedOn")}></input>
          <input placeholder="Review" type="text" {...register("review")}></input>
          <button type="submit">Add</button>
        </form>
      </main>
    </div>
  );
}
