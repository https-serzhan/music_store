import { chance, createRng, pick } from '../utils/rng.js';
import { createLocaleFaker } from '../utils/faker.js';
import type { SupportedLocale } from '../utils/validation.js';
import { generateLikes } from './likesGenerator.js';
import { getLocaleConfig, type LocaleConfig } from './localeService.js';
import { generateMusic, type MusicPreview } from './musicGenerator.js';
import { generateReview } from './reviewGenerator.js';

export type SongCore = {
  index: number;
  title: string;
  artist: string;
  album: string | 'Single';
  genre: string;
};

export type Song = SongCore & {
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

type GenerateSongsInput = {
  locale: SupportedLocale;
  seed: string;
  page: number;
  pageSize: number;
  likesAverage: number;
};

function fillTemplate(template: string, config: LocaleConfig, rng: ReturnType<typeof createRng>): string {
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    switch (token) {
      case 'adjective':
        return pick(rng, config.titleAdjectives);
      case 'noun':
        return pick(rng, config.titleNouns);
      case 'verb':
        return pick(rng, config.titleVerbs);
      case 'place':
        return pick(rng, config.titlePlaces);
      default:
        return '';
    }
  });
}

function fillAlbumTemplate(template: string, config: LocaleConfig, rng: ReturnType<typeof createRng>): string {
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    switch (token) {
      case 'adjective':
        return pick(rng, config.albumAdjectives);
      case 'noun':
        return pick(rng, config.albumNouns);
      case 'place':
        return pick(rng, config.titlePlaces);
      default:
        return '';
    }
  });
}

function generateTitle(config: LocaleConfig, rng: ReturnType<typeof createRng>): string {
  return fillTemplate(pick(rng, config.titlePatterns), config, rng);
}

function generateArtist(config: LocaleConfig, rng: ReturnType<typeof createRng>): string {
  const style = pick(rng, ['person', 'collective', 'prefixed-person', 'prefixed-collective'] as const);

  if (style === 'collective') {
    return pick(rng, config.artistCollectives);
  }

  if (style === 'prefixed-collective') {
    return `${pick(rng, config.artistPrefixes)} ${pick(rng, config.artistCollectives)}`;
  }

  const personName = `${pick(rng, config.artistFirstNames)} ${pick(rng, config.artistLastNames)}`;

  if (style === 'prefixed-person') {
    return `${pick(rng, config.artistPrefixes)} ${personName}`;
  }

  return personName;
}

function generateAlbum(config: LocaleConfig, rng: ReturnType<typeof createRng>): string | 'Single' {
  if (chance(rng, 0.28)) {
    return 'Single';
  }

  return fillAlbumTemplate(pick(rng, config.albumPatterns), config, rng);
}

export function generateSongCore(locale: SupportedLocale, seed: string, index: number): SongCore {
  const config = getLocaleConfig(locale);
  const rng = createRng(`core:${locale}:${seed}:${index}`);
  const faker = createLocaleFaker(locale, `faker:core:${locale}:${seed}:${index}`);

  return {
    index,
    title: chance(rng, 0.5) ? faker.music.songName() : generateTitle(config, rng),
    artist: chance(rng, 0.5) ? faker.music.artist() : generateArtist(config, rng),
    album: chance(rng, 0.5) ? faker.music.album() : generateAlbum(config, rng),
    genre: chance(rng, 0.5) ? faker.music.genre() : pick(rng, config.genres),
  };
}

export function generateSong(
  locale: SupportedLocale,
  seed: string,
  index: number,
  likesAverage: number,
): Song {
  const config = getLocaleConfig(locale);
  const core = generateSongCore(locale, seed, index);

  return {
    ...core,
    likes: generateLikes(seed, index, likesAverage),
    review: generateReview({
      locale,
      seed,
      index,
      title: core.title,
      artist: core.artist,
      config,
    }),
    music: generateMusic(locale, seed, index),
    coverUrl: `/api/cover?locale=${encodeURIComponent(locale)}&seed=${encodeURIComponent(seed)}&index=${index}`,
  };
}

export function generateSongs({
  locale,
  seed,
  page,
  pageSize,
  likesAverage,
}: GenerateSongsInput): SongsResponse {
  const startIndex = (page - 1) * pageSize + 1;
  const songs = Array.from({ length: pageSize }, (_, offset) =>
    generateSong(locale, seed, startIndex + offset, likesAverage),
  );

  return {
    page,
    pageSize,
    locale,
    seed,
    likesAverage,
    songs,
  };
}
