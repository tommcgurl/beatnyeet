// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type TwitchToken = {
  accessToken: string;
  expiresIn: string;
  tokenType: string;
};

const IGDB_BASE_URL = 'https://api.igdb.com/v4'

const _getAuthToken = async () => {
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

type SearchGameArgs = {
  searchString: string;
  token: string;
}
const _searchGame = async ({
  searchString,
  token,
}: SearchGameArgs) => {
  const query = `fields id, name, summary, cover.url; where name ~ "${searchString}"*; limit: 5;`
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
  res: NextApiResponse<TwitchToken | string>
) => {
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
    res.status(500).json(err as string)
  }
}

export default handler