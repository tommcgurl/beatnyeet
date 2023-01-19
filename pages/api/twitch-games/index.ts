// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type TwitchToken = {
  accessToken: string;
  expiresIn: string;
  tokenType: string;
};

export type IGDBPlatform = {
  id: string,
  name: string,
}

export type IGDBCoverImage = {
  id: string,
  url: string
}

export type IGDBGame = {
  id: string;
  name: string;
  summary?: string;
  platforms?: IGDBPlatform[],
  cover?: IGDBCoverImage
}

export const IGDB_BASE_URL = 'https://api.igdb.com/v4'

export const _getAuthToken = async () => {
  const {
    TWITCH_API_ClIENT_ID: clientID,
    TWITCH_API_CLIENT_SECRET: clientSecret
  } = process.env;

  const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: 'POST'
  })
  if (response.status >= 400) {
    throw new Error(`Failed to authenticate with Twitch API: (${response.status}) ${response.statusText}`);
  }
  const responseJSON = await response.json();
  const {
    "access_token": accessToken,
    "expires_in": expiresIn,
    "token_type": tokenType 
  } = responseJSON;
  return {
    accessToken,
    expiresIn,
    tokenType
  }
}

const _getQuery = (searchString: string) => {
  return `
  fields id, name, summary, cover.url, platforms.name, platforms.abbreviation;
  search "${searchString}";
  limit: 10;
`.replace(/\n/g, ' ').trim();
}

type SearchGameArgs = {
  searchString: string;
  token: string;
}
const _searchGame = async ({
  searchString,
  token,
}: SearchGameArgs): Promise<IGDBGame[]> => {
  const query = _getQuery(searchString)
  const {
    TWITCH_API_ClIENT_ID: clientID,
  } = process.env;
  console.log(query)
  const response = await fetch(`${IGDB_BASE_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': clientID as string,
      'Authorization': `Bearer ${token}`
    },
    body: query
  })
  if (response.status >= 400) {
    console.log(`Failed to search game: (${response.status}) ${response.statusText}`)
    throw new Error(`Failed to search game: (${response.status}) ${response.statusText}`)
  }
  return await response.json();
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IGDBGame[] | string>
) => {
  if (!req.query.name) {
    res.status(400).send('Query parameter "name" is required.')
  }
  try {
    // TODO: We don't want to actually get the token with every request. 
    // Instead we can send the token back as a secure http cookie and allow the user
    // to include it in all subsequent requests. We would then validate the token and
    // refresh it if necessary.
    const {accessToken} = await _getAuthToken();
    const searchString = req.query.name as string;
    const result = await _searchGame({
      searchString,
      token: accessToken
    })
    
    res.status(200).json(result);
  } catch(err) {
    res.status(500).send(err as string)
  }
}

export default handler