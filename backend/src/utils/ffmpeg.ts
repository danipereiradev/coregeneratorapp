import { spawn } from 'child_process';
import path from 'path';

export const OUTPUT_WIDTH = 1080;
export const OUTPUT_HEIGHT = 1920;
export const OUTPUT_FPS = 30;
export const TRANSITION_DURATION_SEC = 2;
export const BOOM_VOLUME = 3.375;
export const BACKGROUND_MUSIC_VOLUME = 0.5;
export const BOOM_CUT_MAX_SEC = 1.5;

const VIDEO_FILTER = [
  `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:force_original_aspect_ratio=increase:flags=fast_bilinear`,
  `crop=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}`,
  'setsar=1',
  `fps=${OUTPUT_FPS}`,
].join(',');

export class FfmpegError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FfmpegError';
  }
}

export async function isFfmpegAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', ['-version'], { stdio: 'ignore' });
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}

export function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new FfmpegError('FFmpeg is not installed or not available in PATH.'));
        return;
      }
      reject(err);
    });

    proc.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const detail = stderr.trim();
      if (code === null) {
        console.error('[ffmpeg] Process killed:', signal, detail);
        reject(
          new FfmpegError(
            detail ||
              `Video processing was interrupted (${signal || 'killed'}). Try fewer or shorter clips.`,
          ),
        );
        return;
      }

      console.error('[ffmpeg] Exit', code, detail);
      reject(new FfmpegError(detail || `FFmpeg exited with code ${code}`));
    });
  });
}

export function getNormalizeVideoFilter(): string {
  return VIDEO_FILTER;
}

export function getTitleOverlayFilterComplex(): string {
  return `[0:v]${VIDEO_FILTER}[v0];[v0][1:v]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[v]`;
}

export function getVideoEncodeArgs(): string[] {
  return [
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-crf',
    '28',
    '-threads',
    '1',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(OUTPUT_FPS),
  ];
}

export function getConcatCopyArgs(): string[] {
  return ['-c', 'copy'];
}

export function getVideoCopyArgs(): string[] {
  return ['-c:v', 'copy'];
}

export function getAudioEncodeArgs(): string[] {
  return ['-c:a', 'aac', '-b:a', '128k', '-ar', '44100'];
}

export function getFaststartArgs(): string[] {
  return ['-movflags', '+faststart'];
}

export function getBoomAssetPath(): string {
  return path.resolve(process.cwd(), 'assets', 'boom.mp3');
}

export function getTransitionAssetPath(): string {
  return path.resolve(process.cwd(), 'assets', 'transition.mp4');
}

export function getBackgroundMusicPath(): string {
  return path.resolve(process.cwd(), 'assets', 'QKThr.mp3');
}

export async function hasAudioStream(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn(
      'ffprobe',
      [
        '-v',
        'error',
        '-select_streams',
        'a:0',
        '-show_entries',
        'stream=index',
        '-of',
        'csv=p=0',
        filePath,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );

    let stdout = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.on('error', () => resolve(false));

    proc.on('close', () => {
      resolve(stdout.trim().length > 0);
    });
  });
}

export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => reject(err));

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new FfmpegError(stderr.trim() || `ffprobe exited with code ${code}`));
        return;
      }
      const duration = parseFloat(stdout.trim());
      if (Number.isNaN(duration)) {
        reject(new FfmpegError(`Could not read duration for ${filePath}`));
        return;
      }
      resolve(duration);
    });
  });
}
