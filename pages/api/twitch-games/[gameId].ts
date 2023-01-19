// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {_getAuthToken, IGDBGame, IGDB_BASE_URL} from './index'


const _getQuery = (gameId: number) => {
  return `
  fields id, name, summary, cover.url, platforms.name, platforms.abbreviation;
  where id = ${gameId};
  limit: 10;
`.replace(/\n/g, ' ').trim();
}

type GetGameByIdArgs = {
  gameId: number;
  token: string;
}
const _getGameById = async ({
  gameId,
  token,
}: GetGameByIdArgs): Promise<IGDBGame> => {
  const {
    TWITCH_API_ClIENT_ID: clientID,
  } = process.env;

  const query = _getQuery(gameId)

  const response = await fetch(`${IGDB_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': clientID as string,
      'Authorization': `Bearer ${token}`
    },
    body: query
  })
  if (response.status >= 400) {
    console.log(`Failed to get game with ID "${gameId}": (${response.status}) ${response.statusText}`)
    throw new Error(`Failed to search game: (${response.status}) ${response.statusText}`)
  }
  return await response.json();
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IGDBGame | string>
) => {
  const gameId = parseInt(req.query?.gameId as string);
  if (!gameId || isNaN(gameId)) {
    res.status(400).send('Invalid game ID')
  }
  try {
    // TODO: We don't want to actually get the token with every request. 
    // Instead we can send the token back as a secure http cookie and allow the user
    // to include it in all subsequent requests. We would then validate the token and
    // refresh it if necessary.
    const {accessToken} = await _getAuthToken();
    const result = await _getGameById({
      gameId,
      token: accessToken
    })
    
    res.status(200).json(result);
  } catch(err) {
    res.status(500).send(err as string)
  }
}

export default handler