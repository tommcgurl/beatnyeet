'use client'

import styles from '../page.module.css';
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

type Inputs = {
  gameName: string,
  userName: string,
  platform: string,
  startDate: Date,
  completionDate: Date | null,
  review: string
}

export default function AddPlaythrough() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({ gameName, userName, platform, startDate, completionDate, review }) => {
    const requestData = {
      game: {
        connectOrCreate: {
          where: {
            name: gameName
          },
          create: {
            name: gameName
          }
        }
      },
      user: {
        connectOrCreate: {
          where: {
            username: userName
          },
          create: {
            username: userName
          }
        }
      },
      startDate: new Date(startDate).toISOString(),
      completionDate: completionDate ?  new Date(completionDate).toISOString() : null,
      platform,
      review
    }
    const createPlaythroughResponse = await fetch("http://localhost:3000/api/playthroughs?include=game,user", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {"Content-Type": "application/json"}
    });
    if (createPlaythroughResponse.status >= 400) {
      console.error('somethin dun gone wrong: ', createPlaythroughResponse.body)
      return
    }
    const createdPlaythrough = await createPlaythroughResponse.json()
    console.log(createdPlaythrough)
    router.push('/playthroughs')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Add Playthrough</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Game Name" type="text" {...register("gameName")}></input>
          <input placeholder="User Name" type="text" {...register("userName")}></input>
          <input placeholder="Platform" type="text" {...register("platform")}></input>
          <input placeholder="Start Date" type="date" {...register("startDate")}></input>
          <input placeholder="Completed Date" type="date" {...register("completionDate")}></input>
          <textarea placeholder="Review" {...register("review")}></textarea>
          <button type="submit">Add</button>
        </form>
      </main>
    </div>
  );
}
