export type PlaythroughInputs = {
    gameName: string,
    userName: string,
    platform: string,
    startDate: Date,
    completionDate: Date | null,
    review: string
  }

export const submitPlaythrough = async ({ gameName, userName, platform, startDate, completionDate, review }: PlaythroughInputs) => {
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
  }