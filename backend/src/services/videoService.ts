import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import { ensureDir, fileExists, getTempRoot } from '../utils/cleanup.js';
import { formatCoreTitle, sanitizeFilename } from '../utils/sanitize.js';
import {
  FfmpegError,
  OUTPUT_FPS,
  OUTPUT_HEIGHT,
  OUTPUT_WIDTH,
  TRANSITION_DURATION_SEC,
  BOOM_VOLUME,
  getAudioEncodeArgs,
  getBoomAssetPath,
  getFaststartArgs,
  getNormalizeVideoFilter,
  getTransitionAssetPath,
  getVideoEncodeArgs,
  isFfmpegAvailable,
  runFfmpeg,
} from '../utils/ffmpeg.js';
import { createTitleCardImage, createTitleOverlayImage } from '../utils/titleCard.js';

async function buildTransitionFromTemplate(
  transitionPath: string,
  titleImagePath: string,
  outputPath: string,
  duration: number,
): Promise<void> {
  const boomPath = getBoomAssetPath();
  const hasBoom = await fileExists(boomPath);

  const args = ['-i', transitionPath, '-i', titleImagePath];

  if (hasBoom) {
    args.push('-i', boomPath);
    args.push(
      '-filter_complex',
      '[0:v][1:v]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[v];' +
        `[2:a]volume=${BOOM_VOLUME}[boom];[0:a][boom]amix=inputs=2:duration=first:dropout_transition=0[a]`,
    );
    args.push('-map', '[v]', '-map', '[a]');
  } else {
    args.push(
      '-filter_complex',
      '[0:v][1:v]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[v]',
    );
    args.push('-map', '[v]', '-map', '0:a?');
  }

  args.push(
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    '-t',
    String(duration),
    outputPath,
  );

  await runFfmpeg(args);
}

async function buildTransitionFallback(
  titleImagePath: string,
  outputPath: string,
  duration: number,
): Promise<void> {
  const boomPath = getBoomAssetPath();
  const hasBoom = await fileExists(boomPath);

  const args = [
    '-loop',
    '1',
    '-framerate',
    String(OUTPUT_FPS),
    '-i',
    titleImagePath,
    '-f',
    'lavfi',
    '-i',
    `anullsrc=r=44100:cl=mono:d=${duration}`,
  ];

  if (hasBoom) {
    args.push('-i', boomPath);
    args.push(
      '-filter_complex',
      `[2:a]volume=${BOOM_VOLUME}[boom];[1:a][boom]amix=inputs=2:duration=first:dropout_transition=0[a]`,
    );
    args.push(
      '-vf',
      `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT},format=yuv420p`,
      '-map',
      '0:v',
      '-map',
      '[a]',
    );
  } else {
    args.push(
      '-vf',
      `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT},format=yuv420p`,
      '-map',
      '0:v',
      '-map',
      '1:a',
    );
  }

  args.push(
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    '-t',
    String(duration),
    outputPath,
  );

  await runFfmpeg(args);
}

function interleaveClipsAndTransitions(clips: string[], transitions: string[]): string[] {
  const sequence: string[] = [];

  for (let i = 0; i < clips.length; i++) {
    sequence.push(clips[i]);
    if (i < transitions.length) {
      sequence.push(transitions[i]);
    }
  }

  return sequence;
}

export function createTempJobFolder(): string {
  const jobId = randomUUID();
  return path.join(getTempRoot(), jobId);
}

export async function saveUploadedFiles(
  files: Express.Multer.File[],
  jobFolder: string,
): Promise<string[]> {
  await ensureDir(jobFolder);
  const uploadsDir = path.join(jobFolder, 'uploads');
  await ensureDir(uploadsDir);

  const savedPaths: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = `${String(i + 1).padStart(2, '0')}-${sanitizeFilename(file.originalname)}`;
    const destPath = path.join(uploadsDir, safeName);
    await fs.writeFile(destPath, file.buffer);
    savedPaths.push(destPath);
  }

  return savedPaths;
}

export async function normalizeClip(
  inputPath: string,
  jobFolder: string,
  index: number,
): Promise<string> {
  const normalizedDir = path.join(jobFolder, 'normalized');
  await ensureDir(normalizedDir);

  const outputPath = path.join(
    normalizedDir,
    `clip-${String(index + 1).padStart(2, '0')}.mp4`,
  );

  await runFfmpeg([
    '-i',
    inputPath,
    '-vf',
    getNormalizeVideoFilter(),
    '-map',
    '0:v:0',
    '-map',
    '0:a:0?',
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    outputPath,
  ]);

  return outputPath;
}

export async function createTransitionCard(
  jobFolder: string,
  index: number,
  titleText: string,
): Promise<string> {
  const transitionsDir = path.join(jobFolder, 'transitions');
  await ensureDir(transitionsDir);

  const imagePath = path.join(
    transitionsDir,
    `title-${String(index + 1).padStart(2, '0')}.png`,
  );
  const outputPath = path.join(
    transitionsDir,
    `transition-${String(index + 1).padStart(2, '0')}.mp4`,
  );

  const transitionPath = getTransitionAssetPath();
  const duration = TRANSITION_DURATION_SEC;

  if (await fileExists(transitionPath)) {
    await createTitleOverlayImage(titleText, imagePath);
    await buildTransitionFromTemplate(transitionPath, imagePath, outputPath, duration);
  } else {
    console.warn('[video] transition.mp4 not found – using generated black card');
    await createTitleCardImage(titleText, imagePath);
    await buildTransitionFallback(imagePath, outputPath, duration);
  }

  return outputPath;
}

export async function concatenateClips(
  segmentPaths: string[],
  jobFolder: string,
): Promise<string> {
  const listPath = path.join(jobFolder, 'concat-list.txt');
  const outputPath = path.join(jobFolder, 'output.mp4');

  const listContent = segmentPaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
    .join('\n');

  await fs.writeFile(listPath, listContent, 'utf8');

  await runFfmpeg([
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    listPath,
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    outputPath,
  ]);

  return outputPath;
}

export async function generateCoreVideo(
  inputPaths: string[],
  jobFolder: string,
  personName: string,
): Promise<string> {
  const ffmpegOk = await isFfmpegAvailable();
  if (!ffmpegOk) {
    throw new FfmpegError('FFmpeg is not installed or not available in PATH.');
  }

  const coreTitle = formatCoreTitle(personName);

  console.log(`[video] Normalizing ${inputPaths.length} clips…`);
  const normalizedPaths: string[] = [];

  for (let i = 0; i < inputPaths.length; i++) {
    const normalized = await normalizeClip(inputPaths[i], jobFolder, i);
    normalizedPaths.push(normalized);
    console.log(`[video] Normalized clip ${i + 1}/${inputPaths.length}`);
  }

  console.log(`[video] Creating transition cards: "${coreTitle}"`);
  const transitionPaths: string[] = [];

  for (let i = 0; i < normalizedPaths.length - 1; i++) {
    const card = await createTransitionCard(jobFolder, i, coreTitle);
    transitionPaths.push(card);
    console.log(`[video] Transition card ${i + 1}/${normalizedPaths.length - 1}`);
  }

  const sequence = interleaveClipsAndTransitions(normalizedPaths, transitionPaths);
  console.log(`[video] Concatenating ${sequence.length} segments…`);
  const outputPath = await concatenateClips(sequence, jobFolder);

  console.log('[video] Generation complete');
  return outputPath;
}
