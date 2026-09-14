import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import actsRouter from './routes/acts.js';
import musicRouter from './routes/music.js';
import lightingRouter from './routes/lighting.js';
import videoRouter from './routes/video.js';
import hallRouter from './routes/hall.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Softim' }));

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/acts', actsRouter);
app.use('/api/music', musicRouter);
app.use('/api/lighting', lightingRouter);
app.use('/api/video', videoRouter);
app.use('/api/hall', hallRouter);

app.listen(PORT, () => {
  console.log(`Softim Backend läuft auf Port ${PORT}`);
});
