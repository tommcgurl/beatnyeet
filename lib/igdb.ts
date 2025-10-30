// IGDB API Client for fetching game data from Twitch's Internet Gaming Database

interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  summary?: string;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('IGDB credentials not configured');
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error('Failed to get IGDB access token');
  }

  const data = await response.json();
  
  // Cache token (expires_in is in seconds, convert to milliseconds)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute for safety
  };

  return data.access_token;
}

export async function searchGames(query: string): Promise<IGDBGame[]> {
  const token = await getAccessToken();
  const clientId = process.env.IGDB_CLIENT_ID;

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': clientId!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: `search "${query}"; fields name,cover.url,summary,platforms.name,screenshots.url; limit 10;`,
  });

  if (!response.ok) {
    throw new Error('Failed to search games');
  }

  return response.json();
}

export async function getGameById(gameId: number): Promise<IGDBGame | null> {
  const token = await getAccessToken();
  const clientId = process.env.IGDB_CLIENT_ID;

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': clientId!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: `where id = ${gameId}; fields name,cover.url,summary,platforms.name,screenshots.url;`,
  });

  if (!response.ok) {
    throw new Error('Failed to get game');
  }

  const games = await response.json();
  return games[0] || null;
}

export function formatCoverUrl(url: string, size: 'thumb' | 'cover_small' | 'cover_big' = 'cover_big'): string {
  // IGDB returns URLs like //images.igdb.com/igdb/image/upload/t_thumb/co1234.jpg
  // We need to replace t_thumb with the desired size and add https:
  return url.replace(/\/\//, 'https://').replace(/t_thumb/, `t_${size}`);
}


