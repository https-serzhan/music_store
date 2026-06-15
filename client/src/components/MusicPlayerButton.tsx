import type { MouseEvent } from 'react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import type { Song } from '../types/song';

type MusicPlayerButtonProps = {
  song: Song;
  playbackKey: string;
  compact?: boolean;
};

export function MusicPlayerButton({ song, playbackKey, compact = false }: MusicPlayerButtonProps) {
  const { playingId, play } = useMusicPlayer();
  const trackId = `${playbackKey}:${song.index}`;
  const isPlaying = playingId === trackId;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    void play(trackId, song.music);
  }

  return (
    <button className={compact ? 'button playButton compactPlayButton' : 'button playButton'} type="button" onClick={handleClick}>
      {isPlaying ? 'Stop' : 'Play'}
    </button>
  );
}
