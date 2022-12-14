'use client'

import styles from '../page.module.css';
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { PlaythroughInputs, submitPlaythrough } from './submit-playthrough';

export default function AddPlaythrough() {
  const router = useRouter()
  const { register, handleSubmit } = useForm<PlaythroughInputs>();
  //const onSubmit: SubmitHandler<Inputs> 
  const onSubmit: SubmitHandler<PlaythroughInputs> = (inputs) => {
    submitPlaythrough(inputs)
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
