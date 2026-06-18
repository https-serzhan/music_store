import type { Rng } from '../../utils/rng.js';
import type { SupportedLocale } from '../../utils/validation.js';

export type CoverStyle =
  | 'editorial'
  | 'neon'
  | 'collage'
  | 'vintage'
  | 'ambient'
  | 'glitch'
  | 'bauhaus'
  | 'silhouette';

export type CoverPalette = {
  name: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
};

export type CoverSongInfo = {
  title: string;
  artist: string;
  album: string;
  genre: string;
  locale: SupportedLocale;
  seed: string;
  index: number;
};

export type CoverRenderContext = {
  song: CoverSongInfo;
  rng: Rng;
  width: number;
  height: number;
  palette: CoverPalette;
  style: CoverStyle;
};
