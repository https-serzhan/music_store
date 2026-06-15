import type { SongsRequest, SongsResponse } from '../types/song';

export async function fetchSongs(request: SongsRequest): Promise<SongsResponse> {
  const params = new URLSearchParams({
    locale: request.locale,
    seed: request.seed,
    page: String(request.page),
    pageSize: String(request.pageSize),
    likes: String(request.likes),
  });

  const response = await fetch(`/api/songs?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to fetch songs.');
  }

  return response.json() as Promise<SongsResponse>;
}

export async function fetchRandomSeed(): Promise<string> {
  const response = await fetch('/api/random-seed');

  if (!response.ok) {
    throw new Error('Unable to generate a random seed.');
  }

  const data = (await response.json()) as { seed: string };
  return data.seed;
}
