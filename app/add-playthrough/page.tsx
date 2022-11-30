import styles from '../page.module.css';

async function fetchPlaythroughData() {
  const playthroughs = await fetch("http://localhost:3000/api/playthroughs?include=game,user");
  return playthroughs.json();
}

export default function AddPlaythrough() {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Add Playthrough</h1>
        <span>Edit <p className={styles.code}>app/add-playthrough/page.tsx</p> and create a form</span>
      </main>
    </div>
  );
}
