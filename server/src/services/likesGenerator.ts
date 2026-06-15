import { chance, createRng } from '../utils/rng.js';

export function generateLikes(seed: string, index: number, averageLikes: number): number {
  const normalizedAverage = Math.max(0, Math.min(10, averageLikes));

  if (normalizedAverage <= 0) {
    return 0;
  }

  if (normalizedAverage >= 10) {
    return 10;
  }

  const guaranteedLikes = Math.floor(normalizedAverage);
  const fractionalChance = normalizedAverage - guaranteedLikes;
  const rng = createRng(`likes:${seed}:${index}:${String(normalizedAverage)}`);

  return guaranteedLikes + (chance(rng, fractionalChance) ? 1 : 0);
}
