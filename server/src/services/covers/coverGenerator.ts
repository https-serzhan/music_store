import { createRng } from '../../utils/rng.js';
import type { SupportedLocale } from '../../utils/validation.js';
import type { CoverRenderContext, CoverStyle } from './coverTypes.js';
import { pickPalette } from './palettes.js';
import { pick } from './svgHelpers.js';
import { renderAmbient } from './styles/ambient.js';
import { renderBauhaus } from './styles/bauhaus.js';
import { renderCollage } from './styles/collage.js';
import { renderEditorial } from './styles/editorial.js';
import { renderGlitch } from './styles/glitch.js';
import { renderNeon } from './styles/neon.js';
import { renderSilhouette } from './styles/silhouette.js';
import { renderVintage } from './styles/vintage.js';

type CoverInput = {
  locale: SupportedLocale;
  seed: string;
  index: number;
  title: string;
  artist: string;
  album?: string;
  genre: string;
};

const allStyles: CoverStyle[] = [
  'editorial',
  'neon',
  'collage',
  'vintage',
  'ambient',
  'glitch',
  'bauhaus',
  'silhouette',
];

function stylePoolForGenre(genre: string): CoverStyle[] {
  const value = genre.toLowerCase();

  if (
    value.includes('elect') ||
    value.includes('techno') ||
    value.includes('dance') ||
    value.includes('edm') ||
    value.includes('synth') ||
    value.includes('house')
  ) {
    return ['neon', 'glitch', 'ambient'];
  }

  if (value.includes('rock') || value.includes('metal') || value.includes('punk') || value.includes('grunge')) {
    return ['collage', 'vintage', 'glitch'];
  }

  if (value.includes('jazz') || value.includes('blues') || value.includes('soul') || value.includes('r&b')) {
    return ['editorial', 'vintage', 'silhouette'];
  }

  if (value.includes('classical') || value.includes('instrumental') || value.includes('orchestra')) {
    return ['editorial', 'ambient'];
  }

  if (value.includes('pop') || value.includes('funk') || value.includes('disco')) {
    return ['collage', 'bauhaus', 'neon'];
  }

  if (value.includes('folk') || value.includes('country') || value.includes('acoustic') || value.includes('americana')) {
    return ['vintage', 'silhouette', 'editorial'];
  }

  if (value.includes('ambient') || value.includes('chill') || value.includes('experimental') || value.includes('drone')) {
    return ['ambient', 'silhouette', 'glitch'];
  }

  if (value.includes('hip') || value.includes('rap') || value.includes('trap')) {
    return ['collage', 'glitch', 'silhouette'];
  }

  return allStyles;
}

function pickCoverStyle(ctxGenre: string, rng: ReturnType<typeof createRng>): CoverStyle {
  return pick(rng, stylePoolForGenre(ctxGenre));
}

export function generateCoverSvg({ locale, seed, index, title, artist, album = 'Single', genre }: CoverInput): string {
  const rng = createRng(`cover:${locale}:${seed}:${index}`);
  const style = pickCoverStyle(genre, rng);
  const palette = pickPalette(rng, genre, style);
  const ctx: CoverRenderContext = {
    song: { title, artist, album, genre, locale, seed, index },
    rng,
    width: 800,
    height: 800,
    palette,
    style,
  };

  switch (style) {
    case 'editorial':
      return renderEditorial(ctx);
    case 'neon':
      return renderNeon(ctx);
    case 'collage':
      return renderCollage(ctx);
    case 'vintage':
      return renderVintage(ctx);
    case 'ambient':
      return renderAmbient(ctx);
    case 'glitch':
      return renderGlitch(ctx);
    case 'bauhaus':
      return renderBauhaus(ctx);
    case 'silhouette':
      return renderSilhouette(ctx);
  }
}
