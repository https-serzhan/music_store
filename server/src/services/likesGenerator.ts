import { times } from '../utils/fractionalTimes.js';
import { createRng } from '../utils/rng.js';

export function generateLikes(seed: string, index: number, averageLikes: number): number {
  const normalizedAverage = Math.max(0, Math.min(10, averageLikes));

  if (normalizedAverage <= 0) {
    return 0;
  }

  if (normalizedAverage >= 10) {
    return 10;
  }

  const rng = createRng(`likes:${seed}:${index}:${String(normalizedAverage)}`);

  return times<number>(normalizedAverage, rng, (likes) => likes + 1)(0);
}
