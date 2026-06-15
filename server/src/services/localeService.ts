import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SupportedLocale } from '../utils/validation.js';

export type LocaleConfig = {
  label: string;
  titleAdjectives: string[];
  titleNouns: string[];
  titleVerbs: string[];
  titlePlaces: string[];
  titlePatterns: string[];
  artistFirstNames: string[];
  artistLastNames: string[];
  artistCollectives: string[];
  artistPrefixes: string[];
  albumAdjectives: string[];
  albumNouns: string[];
  albumPatterns: string[];
  genres: string[];
  reviewMoods: string[];
  reviewImages: string[];
  reviewMoments: string[];
  reviewTemplates: string[];
};

const configs = new Map<SupportedLocale, LocaleConfig>();

function localeDirectories(): string[] {
  const serviceDirectory = path.dirname(fileURLToPath(import.meta.url));

  return [
    path.resolve(serviceDirectory, '../locales'),
    path.resolve(process.cwd(), 'src/locales'),
    path.resolve(process.cwd(), 'dist/locales'),
  ];
}

function readLocale(locale: SupportedLocale): LocaleConfig {
  for (const directory of localeDirectories()) {
    const filePath = path.join(directory, `${locale}.json`);

    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, 'utf-8')) as LocaleConfig;
    }
  }

  throw new Error(`Locale file not found for ${locale}.`);
}

export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  const existing = configs.get(locale);

  if (existing) {
    return existing;
  }

  const config = readLocale(locale);
  configs.set(locale, config);
  return config;
}
