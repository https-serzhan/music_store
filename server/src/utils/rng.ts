import seedrandom from 'seedrandom';

export type Rng = seedrandom.PRNG;

export function createRng(seedString: string): Rng {
  return seedrandom(seedString);
}

export function randomFloat(rng: Rng): number {
  return rng();
}

export function randomInt(rng: Rng, min: number, max: number): number {
  return Math.floor(randomFloat(rng) * (max - min + 1)) + min;
}

export function pick<T>(rng: Rng, array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from an empty array.');
  }

  return array[randomInt(rng, 0, array.length - 1)];
}

export function chance(rng: Rng, probability: number): boolean {
  const normalized = Math.max(0, Math.min(1, probability));
  return randomFloat(rng) < normalized;
}
