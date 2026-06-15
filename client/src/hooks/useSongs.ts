import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSongs } from '../api/songsApi';
import type { SongsRequest } from '../types/song';

export function useSongs(request: SongsRequest) {
  return useQuery({
    queryKey: ['songs', request.locale, request.seed, request.page, request.pageSize, request.likes],
    queryFn: () => fetchSongs(request),
    placeholderData: keepPreviousData,
  });
}
