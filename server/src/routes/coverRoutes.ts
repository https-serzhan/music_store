import { Router } from 'express';
import { ZodError } from 'zod';
import { generateCoverSvg } from '../services/coverGenerator.js';
import { generateSongCore } from '../services/songGenerator.js';
import { coverQuerySchema } from '../utils/validation.js';

export const coverRoutes = Router();

coverRoutes.get('/cover', (request, response) => {
  try {
    const query = coverQuerySchema.parse(request.query);
    const song = generateSongCore(query.locale, query.seed, query.index);
    const svg = generateCoverSvg({
      locale: query.locale,
      seed: query.seed,
      index: query.index,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
    });

    response.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    response.send(svg);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: error.flatten() });
      return;
    }

    response.status(500).json({ error: 'Unable to generate cover.' });
  }
});
