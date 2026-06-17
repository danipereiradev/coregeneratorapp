import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import { ensureDir, fileExists, getTempRoot } from '../utils/cleanup.js';
import { END_BRANDING_TEXT, formatCoreTitle } from '../utils/sanitize.js';
import {
  BACKGROUND_MUSIC_VOLUME,
  BOOM_CUT_MAX_SEC,
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
  await runFfmpeg([
    '-i',
    transitionPath,
    '-i',
    brandingImagePath,
    '-f',
    'lavfi',
    '-i',
    `anullsrc=r=44100:cl=stereo:d=${duration}`,
    '-filter_complex',
    '[0:v][1:v]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[v]',
    '-map',
    '[v]',
    '-map',
    '2:a',
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    '-t',
    String(duration),
    outputPath,
  ]);
}

async function buildEndTransitionFallback(
  brandingImagePath: string,
  outputPath: string,
  duration: number,
): Promise<void> {
  await runFfmpeg([
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
    '-vf',
    `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT},format=yuv420p`,
    '-map',
    '0:v',
    '-map',
    '1:a',
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    '-t',
    String(duration),
    outputPath,
  ]);
}

async function createBoomCut(jobFolder: string, index: number): Promise<string | null> {
  const boomPath = getBoomAssetPath();
  if (!(await fileExists(boomPath))) {
    console.warn('[video] boom.mp3 not found – skipping boom between clips');
    return null;
  }

  const boomsDir = path.join(jobFolder, 'booms');
  await ensureDir(boomsDir);

  const outputPath = path.join(boomsDir, `boom-${String(index + 1).padStart(2, '0')}.mp4`);
  const boomDuration = Math.min(await getMediaDuration(boomPath), BOOM_CUT_MAX_SEC);

  await runFfmpeg([
    '-f',
    'lavfi',
    '-i',
    `color=c=black:s=${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}:r=${OUTPUT_FPS}`,
    '-i',
    boomPath,
    '-filter_complex',
    `[1:a]volume=${BOOM_VOLUME},aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:${boomDuration},asetpts=PTS-STARTPTS[a]`,
    '-map',
    '0:v',
    '-map',
    '[a]',
    '-t',
    String(boomDuration),
    ...getVideoEncodeArgs(),
    ...getAudioEncodeArgs(),
    ...getFaststartArgs(),
    outputPath,
  ]);

  return outputPath;
}

function interleaveClipsWithBooms(clips: string[], booms: (string | null)[]): string[] {
  const sequence: string[] = [];

  for (let i = 0; i < clips.length; i++) {
    sequence.push(clips[i]);
    if (i < booms.length && booms[i]) {
      sequence.push(booms[i]!);
    }
  }

  return sequence;
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

  console.log('[video] Creating boom cuts between clips…');
  const boomCuts: (string | null)[] = [];
  for (let i = 0; i < titledClipPaths.length - 1; i++) {
    boomCuts.push(await createBoomCut(jobFolder, i));
  }

  const sequence = interleaveClipsWithBooms(titledClipPaths, boomCuts);
  sequence.push(endTransition);
  console.log(`[video] Concatenating ${sequence.length} segments…`);
  const concatenatedPath = await concatenateClips(sequence, jobFolder, 'concatenated.mp4');

  console.log('[video] Mixing background music…');
  const outputPath = await mixBackgroundMusic(concatenatedPath, jobFolder);

  console.log('[video] Generation complete');
  return outputPath;
}
