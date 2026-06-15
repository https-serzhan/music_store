import { CoverImage } from './CoverImage';
import { MusicPlayerButton } from './MusicPlayerButton';
import type { Song } from '../types/song';

type SongDetailsProps = {
  song: Song;
  playbackKey: string;
};

export function SongDetails({ song, playbackKey }: SongDetailsProps) {
  return (
    <div className="songDetails">
      <CoverImage src={song.coverUrl} title={song.title} artist={song.artist} className="detailsCover" />
      <div className="detailsContent">
        <div className="detailsHeader">
          <div>
            <p className="detailsKicker">Preview</p>
            <h3>{song.title}</h3>
          </div>
          <MusicPlayerButton song={song} playbackKey={playbackKey} />
        </div>
        <p className="reviewText">{song.review}</p>
        <div className="musicMeta">
          <span>{song.music.bpm} BPM</span>
          <span>
            {song.music.key} {song.music.scale}
          </span>
          <span>{song.music.synth.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
