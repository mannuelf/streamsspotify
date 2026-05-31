/**
 * Spotify API Utility
 * Handles OAuth PKCE Flow and Data Fetching
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/callback';

export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('code_verifier', verifier);

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('response_type', 'code');
  params.append('redirect_uri', REDIRECT_URI);
  params.append('scope', 'user-read-private user-read-email user-top-read user-read-recently-played');
  params.append('code_challenge_method', 'S256');
  params.append('code_challenge', challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(digest));
  return btoa(String.fromCharCode.apply(null, hashArray as any))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getAccessToken(code: string): Promise<string> {
  const verifier = localStorage.getItem('code_verifier');

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code_verifier', verifier!);

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) throw new Error('No access token found');

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/';
  }

  return await res.json();
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export async function getTopTracks(timeRange: TimeRange = 'medium_term', limit = 20) {
  return await fetchWebApi(`v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, 'GET');
}

export async function getTopArtists(timeRange: TimeRange = 'medium_term', limit = 20) {
  return await fetchWebApi(`v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, 'GET');
}

export async function getRecentlyPlayed(limit = 20) {
  return await fetchWebApi(`v1/me/player/recently-played?limit=${limit}`, 'GET');
}

export async function getProfile() {
  return await fetchWebApi('v1/me', 'GET');
}

export function calculateTopGenres(artists: any[]) {
  const genresCount: Record<string, number> = {};
  artists.forEach((artist) => {
    artist.genres.forEach((genre: string) => {
      genresCount[genre] = (genresCount[genre] || 0) + 1;
    });
  });

  return Object.entries(genresCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}
