import { randomBytes } from 'node:crypto';
import { Router } from 'express';

export const seedRoutes = Router();

seedRoutes.get('/random-seed', (_request, response) => {
  const seed = randomBytes(8).readBigUInt64BE(0).toString();
  response.json({ seed });
});

seedRoutes.get('/health', (_request, response) => {
  response.json({ ok: true });
});
