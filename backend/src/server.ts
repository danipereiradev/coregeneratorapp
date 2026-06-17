import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import generateRouter from './routes/generate.js';
import type { GenerateErrorResponse } from './types/index.js';
import { FfmpegError } from './utils/ffmpeg.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

const generateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many generation requests. Please try again later.' },
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'coregenerator-backend' });
});

app.use('/api/generate', generateRateLimit, generateRouter);

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[server] Error:', err);

    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'One or more files exceed the maximum upload size.'
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Too many files uploaded.'
            : err.message;

      res.status(400).json({ error: message } satisfies GenerateErrorResponse);
      return;
    }

    if (err instanceof FfmpegError) {
      res.status(503).json({ error: err.message } satisfies GenerateErrorResponse);
      return;
    }

    if (err instanceof Error) {
      res.status(400).json({ error: err.message } satisfies GenerateErrorResponse);
      return;
    }

    res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    } satisfies GenerateErrorResponse);
  },
);

app.listen(PORT, () => {
  console.log(`CoreGenerator backend running on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${FRONTEND_URL}`);
});
