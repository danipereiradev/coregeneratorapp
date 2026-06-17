import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import { ensureDir, fileExists, getTempRoot } from '../utils/cleanup.js';
import { END_BRANDING_TEXT, formatCoreTitle } from '../utils/sanitize.js';
import {
  BACKGROUND_MUSIC_VOLUME,
  BOOM_VOLUME,
  FfmpegError,
  OUTPUT_FPS,
  OUTPUT_HEIGHT,
  OUTPUT_WIDTH,
  TRANSITION_DURATION_SEC,
  getAudioEncodeArgs,
  getBackgroundMusicPath,
  getBoomAssetPath,
  getConcatCopyArgs,
  getFaststartArgs,
  getMediaDuration,
  getTitleOverlayFilterComplex,
  getTransitionAssetPath,
  getVideoCopyArgs,
  getVideoEncodeArgs,
  hasAudioStream,
  isFfmpegAvailable,
  runFfmpeg,
} from '../utils/ffmpeg.js';
import { createBrandingOverlayImage, createTitleOverlayImage } from '../utils/titleCard.js';

async function buildEndTransitionFromTemplate(
  transitionPath: string,
  brandingImagePath: string,
  outputPath: string,
  duration: number,
): Promise<void> {
  const boomPath = getBoomAssetPath();
  const hasBoom = await fileExists(boomPath);

  const args = ['-i', transitionPath, '-i', brandingImagePath];

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

async function buildEndTransitionFallback(
  brandingImagePath: string,
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
    brandingImagePath,
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

export function createTempJobFolder(): string {
  const jobId = randomUUID();
  return path.join(getTempRoot(), jobId);
}

export function getUploadedFilePaths(files: Express.Multer.File[]): string[] {
  return files
    .map((file) => file.path)
    .filter((filePath): filePath is string => Boolean(filePath))
    .sort();
}

export async function processClipWithTitle(
  inputPath: string,
  titleImagePath: string,
  jobFolder: string,
  index: number,
): Promise<string> {
  const outputDir = path.join(jobFolder, 'processed');
  await ensureDir(outputDir);

  const outputPath = path.join(
    outputDir,
    `clip-${String(index + 1).padStart(2, '0')}.mp4`,
  );

  await runFfmpeg([
    '-i',
    inputPath,
    '-i',
    titleImagePath,
    '-filter_complex',
    getTitleOverlayFilterComplex(),
    '-map',
    '[v]',
    '-map',
    '0:a?',
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    outputPath,
  ]);

  return outputPath;
}

export async function createEndTransition(
  jobFolder: string,
  brandingText: string,
): Promise<string> {
  const endDir = path.join(jobFolder, 'end');
  await ensureDir(endDir);

  const imagePath = path.join(endDir, 'branding.png');
  const outputPath = path.join(endDir, 'end-transition.mp4');
  const transitionPath = getTransitionAssetPath();
  const duration = TRANSITION_DURATION_SEC;

  await createBrandingOverlayImage(brandingText, imagePath);

  if (await fileExists(transitionPath)) {
    await buildEndTransitionFromTemplate(transitionPath, imagePath, outputPath, duration);
  } else {
    console.warn('[video] transition.mp4 not found – using generated end card');
    await buildEndTransitionFallback(imagePath, outputPath, duration);
  }

  return outputPath;
}

export async function concatenateClips(
  segmentPaths: string[],
  jobFolder: string,
  outputName = 'output.mp4',
): Promise<string> {
  const listPath = path.join(jobFolder, 'concat-list.txt');
  const outputPath = path.join(jobFolder, outputName);

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
    ...getConcatCopyArgs(),
    ...getFaststartArgs(),
    outputPath,
  ]);

  return outputPath;
}

export async function mixBackgroundMusic(
  videoPath: string,
  jobFolder: string,
): Promise<string> {
  const musicPath = getBackgroundMusicPath();
  if (!(await fileExists(musicPath))) {
    console.warn('[video] QKThr.mp3 not found – skipping background music');
    return videoPath;
  }

  const duration = await getMediaDuration(videoPath);
  const outputPath = path.join(jobFolder, 'output-with-music.mp4');
  const hasClipAudio = await hasAudioStream(videoPath);

  if (hasClipAudio) {
    await runFfmpeg([
      '-i',
      videoPath,
      '-stream_loop',
      '-1',
      '-i',
      musicPath,
      '-filter_complex',
      `[1:a]volume=${BACKGROUND_MUSIC_VOLUME},atrim=0:${duration},asetpts=PTS-STARTPTS[bg];` +
        `[0:a]aformat=sample_rates=44100:channel_layouts=stereo,apad=whole_dur=${duration}[va];` +
        '[va][bg]amix=inputs=2:duration=first:dropout_transition=2[a]',
      '-map',
      '0:v',
      '-map',
      '[a]',
      ...getVideoCopyArgs(),
      ...getAudioEncodeArgs(),
      ...getFaststartArgs(),
      '-t',
      String(duration),
      outputPath,
    ]);
  } else {
    await runFfmpeg([
      '-i',
      videoPath,
      '-stream_loop',
      '-1',
      '-i',
      musicPath,
      '-filter_complex',
      `[1:a]volume=${BACKGROUND_MUSIC_VOLUME},atrim=0:${duration},asetpts=PTS-STARTPTS[a]`,
      '-map',
      '0:v',
      '-map',
      '[a]',
      ...getVideoCopyArgs(),
      ...getAudioEncodeArgs(),
      ...getFaststartArgs(),
      '-t',
      String(duration),
      outputPath,
    ]);
  }

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
  const overlaysDir = path.join(jobFolder, 'overlays');
  await ensureDir(overlaysDir);
  const titleImagePath = path.join(overlaysDir, 'title.png');
  await createTitleOverlayImage(coreTitle, titleImagePath);

  console.log(`[video] Processing ${inputPaths.length} clips…`);
  const titledClipPaths: string[] = [];

  for (let i = 0; i < inputPaths.length; i++) {
    const titledPath = await processClipWithTitle(
      inputPaths[i],
      titleImagePath,
      jobFolder,
      i,
    );
    titledClipPaths.push(titledPath);
    console.log(`[video] Processed clip ${i + 1}/${inputPaths.length}`);
  }

  console.log(`[video] Creating end transition: "${END_BRANDING_TEXT}"`);
  const endTransition = await createEndTransition(jobFolder, END_BRANDING_TEXT);

  const sequence = [...titledClipPaths, endTransition];
  console.log(`[video] Concatenating ${sequence.length} segments…`);
  const concatenatedPath = await concatenateClips(sequence, jobFolder, 'concatenated.mp4');

  console.log('[video] Mixing background music…');
  const outputPath = await mixBackgroundMusic(concatenatedPath, jobFolder);

  console.log('[video] Generation complete');
  return outputPath;
}
