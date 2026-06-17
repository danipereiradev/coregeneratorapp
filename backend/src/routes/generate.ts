import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  DEFAULT_MAX_UPLOAD_MB,
  MAX_CLIPS,
  MIN_CLIPS,
  type GenerateErrorResponse,
} from '../types/index.js';
import { cleanupJobFolder, scheduleCleanup } from '../utils/cleanup.js';
import { isAllowedVideoFile, validatePersonName } from '../utils/sanitize.js';
import {
  createTempJobFolder,
  generateCoreVideo,
  saveUploadedFiles,
} from '../services/videoService.js';

const maxUploadMb = Number(process.env.MAX_UPLOAD_MB) || DEFAULT_MAX_UPLOAD_MB;
const maxUploadBytes = maxUploadMb * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadBytes,
    files: MAX_CLIPS,
  },
  fileFilter: (_req, file, cb) => {
    if (isAllowedVideoFile(file.mimetype, file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`File "${file.originalname}" is not an allowed video format.`));
    }
  },
});

const router = Router();

router.post(
  '/',
  upload.array('videos', MAX_CLIPS),
  async (req: Request, res: Response, next: NextFunction) => {
    const jobFolder = createTempJobFolder();

    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length < MIN_CLIPS) {
        res.status(400).json({
          error: `Please upload at least ${MIN_CLIPS} video clips.`,
        } satisfies GenerateErrorResponse);
        return;
      }

      if (files.length > MAX_CLIPS) {
        res.status(400).json({
          error: `Maximum ${MAX_CLIPS} video clips allowed.`,
        } satisfies GenerateErrorResponse);
        return;
      }

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > maxUploadBytes) {
        res.status(400).json({
          error: `Total upload size must not exceed ${maxUploadMb} MB.`,
        } satisfies GenerateErrorResponse);
        return;
      }

      const personNameError = validatePersonName(
        typeof req.body.personName === 'string' ? req.body.personName : '',
      );
      if (personNameError) {
        res.status(400).json({ error: personNameError } satisfies GenerateErrorResponse);
        return;
      }

      const personName =
        typeof req.body.personName === 'string' ? req.body.personName.trim() : '';

      console.log(
        `[generate] Job started – ${files.length} clips, ${(totalSize / (1024 * 1024)).toFixed(1)} MB, title for "${personName}"`,
      );

      const savedPaths = await saveUploadedFiles(files, jobFolder);
      const outputPath = await generateCoreVideo(savedPaths, jobFolder, personName);
      console.log('[generate] Video ready:', outputPath);

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'attachment; filename="core-video.mp4"');

      const stream = fs.createReadStream(outputPath);
      stream.pipe(res);

      stream.on('end', () => {
        scheduleCleanup(jobFolder);
      });

      stream.on('error', (err) => {
        console.error('[generate] Stream error:', err);
        scheduleCleanup(jobFolder);
      });
    } catch (err) {
      await cleanupJobFolder(jobFolder);
      next(err);
    }
  },
);

export default router;
