import { useEffect, useMemo, useRef } from 'react';
import { CoverImage } from './CoverImage';
import { MusicPlayerButton } from './MusicPlayerButton';
import { useInfiniteSongs } from '../hooks/useInfiniteSongs';
import type { SupportedLocale } from '../types/song';

type GalleryViewProps = {
  locale: SupportedLocale;
  seed: string;
  likes: number;
  pageSize: number;
  playbackKey: string;
  resetKey: string;
};

export function GalleryView({ locale, seed, likes, pageSize, playbackKey, resetKey }: GalleryViewProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } = useInfiniteSongs({
    locale,
    seed,
    likes,
    pageSize,
  });
  const songs = useMemo(() => data?.pages.flatMap((page) => page.songs) ?? [], [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [resetKey]);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root, rootMargin: '420px 0px', threshold: 0.01 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, isFetchingNextPage, songs.length]);

  if (isLoading && songs.length === 0) {
    return <div className="statePanel">Loading gallery...</div>;
  }

  if (error instanceof Error) {
    return <div className="statePanel errorPanel">{error.message}</div>;
  }

  return (
    <section className="galleryScroll" ref={scrollRef}>
      <div className="galleryGrid">
        {songs.map((song) => (
          <article className="galleryCard" key={song.index}>
            <div className="cardCoverWrap">
              <CoverImage src={song.coverUrl} title={song.title} artist={song.artist} />
              <span className="cardIndex">#{song.index}</span>
            </div>
            <div className="cardBody">
              <div className="cardTitleRow">
                <h3>{song.title}</h3>
                <span className="likesPill">{song.likes}</span>
              </div>
              <p className="artistLine">{song.artist}</p>
              <p className="albumLine">{song.album}</p>
              <div className="cardFooter">
                <span className="genreTag">{song.genre}</span>
                <MusicPlayerButton song={song} playbackKey={playbackKey} compact />
              </div>
            </div>
          </article>
        ))}
      </div>
      <div ref={sentinelRef} className="gallerySentinel">
        {isFetchingNextPage ? 'Loading more songs...' : ' '}
      </div>
    </section>
  );
}
