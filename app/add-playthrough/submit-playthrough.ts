export type PlaythroughInputs = {
    gameId: string,
    userName: string,
    platformId: string,
    startDate: Date,
    completionDate: Date | null,
    review: string
  }

export const submitPlaythrough = async ({ gameId, userName, platformId, startDate, completionDate, review }: PlaythroughInputs) => {
    const requestData = {
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
      platformId,
      gameId,
      review
    }
    const createPlaythroughResponse = await fetch("http://localhost:3000/api/playthroughs?include=user", {
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
  }