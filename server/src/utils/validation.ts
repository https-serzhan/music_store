import { z } from 'zod';

export const supportedLocales = ['en-US', 'de-DE', 'uk-UA'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const maxUint64 = BigInt('18446744073709551615');

function isUnsigned64(value: string): boolean {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  try {
    return BigInt(value) <= maxUint64;
  } catch {
    return false;
  }
}

const seedSchema = z
  .string()
  .trim()
  .default('123456789')
  .transform((value) => (value.length === 0 ? '123456789' : value))
  .refine(isUnsigned64, {
    message: 'Seed must be an unsigned 64-bit integer string.',
  });

export const songsQuerySchema = z.object({
  locale: z.enum(supportedLocales).default('en-US'),
  seed: seedSchema,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  likes: z.coerce.number().min(0).max(10).default(3),
});

export const coverQuerySchema = z.object({
  locale: z.enum(supportedLocales).default('en-US'),
  seed: seedSchema,
  index: z.coerce.number().int().min(1),
});
