import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSongs } from '../api/songsApi';
import type { SongsRequest } from '../types/song';

type InfiniteSongsRequest = Omit<SongsRequest, 'page'>;

export function useInfiniteSongs(request: InfiniteSongsRequest) {
  return useInfiniteQuery({
    queryKey: ['infiniteSongs', request.locale, request.seed, request.pageSize, request.likes],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchSongs({ ...request, page: Number(pageParam) }),
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });
}
