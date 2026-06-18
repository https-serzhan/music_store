import type { Rng } from './rng.js';
import { chance } from './rng.js';

export function times<T>(n: number, rng: Rng, fn: (value: T) => T): (initialValue: T) => T {
  if (n < 0) {
    throw new Error('The first argument cannot be negative.');
  }

  return (initialValue: T): T => {
    let value = initialValue;

    for (let index = 0; index < Math.floor(n); index += 1) {
      value = fn(value);
    }

    return chance(rng, n % 1) ? fn(value) : value;
  };
}
