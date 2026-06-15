import { createRng, pick } from '../utils/rng.js';
import type { SupportedLocale } from '../utils/validation.js';
import type { LocaleConfig } from './localeService.js';

type ReviewInput = {
  locale: SupportedLocale;
  seed: string;
  index: number;
  title: string;
  artist: string;
  config: LocaleConfig;
};

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

export function generateReview({ locale, seed, index, title, artist, config }: ReviewInput): string {
  const rng = createRng(`review:${locale}:${seed}:${index}`);
  const template = pick(rng, config.reviewTemplates);

  return fillTemplate(template, {
    title,
    artist,
    mood: pick(rng, config.reviewMoods),
    image: pick(rng, config.reviewImages),
    moment: pick(rng, config.reviewMoments),
  });
}
