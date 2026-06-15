import { Faker, de, en, uk } from '@faker-js/faker';
import type { SupportedLocale } from './validation.js';

export function hashSeedToUint32(seedString: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seedString.length; index += 1) {
    hash ^= seedString.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createLocaleFaker(locale: SupportedLocale, seedString: string): Faker {
  const localeData = locale === 'de-DE' ? de : locale === 'uk-UA' ? uk : en;
  const faker = new Faker({ locale: [localeData, en] });
  faker.seed(hashSeedToUint32(seedString));
  return faker;
}
