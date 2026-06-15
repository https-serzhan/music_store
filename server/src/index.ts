import cors from 'cors';
import express from 'express';
import { coverRoutes } from './routes/coverRoutes.js';
import { seedRoutes } from './routes/seedRoutes.js';
import { songsRoutes } from './routes/songsRoutes.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use('/api', songsRoutes);
app.use('/api', coverRoutes);
app.use('/api', seedRoutes);

app.listen(port, () => {
  console.log(`Task 5 music store API listening on http://localhost:${port}`);
});
