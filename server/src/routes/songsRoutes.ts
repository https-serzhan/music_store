import { Router } from 'express';
import { ZodError } from 'zod';
import { generateSongs } from '../services/songGenerator.js';
import { songsQuerySchema } from '../utils/validation.js';

export const songsRoutes = Router();

songsRoutes.get('/songs', (request, response) => {
  try {
    const query = songsQuerySchema.parse(request.query);
    const result = generateSongs({
      locale: query.locale,
      seed: query.seed,
      page: query.page,
      pageSize: query.pageSize,
      likesAverage: query.likes,
    });

    response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({ error: error.flatten() });
      return;
    }

    response.status(500).json({ error: 'Unable to generate songs.' });
  }
});
