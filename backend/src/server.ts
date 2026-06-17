import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import generateRouter from './routes/generate.js';
import type { GenerateErrorResponse } from './types/index.js';
import { FfmpegError, isFfmpegAvailable } from './utils/ffmpeg.js';

const app = express();
app.set('trust proxy', 1);

const PORT = Number(process.env.PORT) || 4000;

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;

  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) return true;

  try {
    const { hostname, protocol } = new URL(normalized);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return allowedOrigins.some((o) => o.includes('localhost') || o.includes('127.0.0.1'));
    }
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      console.warn(`[cors] Blocked origin: ${origin}`);
      callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);
app.use(express.json());

const generateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many generation requests. Please try again later.' },
});

app.get('/api/health', async (_req, res) => {
  const ffmpeg = await isFfmpegAvailable();
  const body = {
    status: ffmpeg ? 'ok' : 'degraded',
    service: 'coregenerator-backend',
    ffmpeg,
  };
  res.status(ffmpeg ? 200 : 503).json(body);
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CoreGenerator backend listening on port ${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
