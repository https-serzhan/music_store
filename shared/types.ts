export type SupportedLocale = 'en-US' | 'de-DE' | 'uk-UA';
export type DisplayMode = 'table' | 'gallery';
export type ScaleMode = 'major' | 'minor';
export type SynthType = 'synth' | 'fm' | 'am';

type ChordEvent = {
  time: string;
  notes: string[];
  duration: string;
};

type NoteEvent = {
  time: string;
  note: string;
  duration: string;
};

export type MusicPreview = {
  bpm: number;
  key: string;
  scale: ScaleMode;
  synth: SynthType;
  chords: ChordEvent[];
  melody: NoteEvent[];
  bass: NoteEvent[];
};

export type Song = {
  index: number;
  title: string;
  artist: string;
  album: string | 'Single';
  genre: string;
  likes: number;
  review: string;
  music: MusicPreview;
  coverUrl: string;
};

export type SongsResponse = {
  page: number;
  pageSize: number;
  locale: SupportedLocale;
  seed: string;
  likesAverage: number;
  songs: Song[];
};

export type SongsRequest = {
  locale: SupportedLocale;
  seed: string;
  page: number;
  pageSize: number;
  likes: number;
};
