import { spawn } from 'child_process';
import path from 'path';

export const OUTPUT_WIDTH = 1080;
export const OUTPUT_HEIGHT = 1920;
export const OUTPUT_FPS = 30;
export const TRANSITION_DURATION_SEC = 2;
export const BOOM_VOLUME = 1.125;

const VIDEO_FILTER = [
  `scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:force_original_aspect_ratio=increase`,
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

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new FfmpegError(stderr.trim() || `FFmpeg exited with code ${code}`));
    });
  });
}

export function getNormalizeVideoFilter(): string {
  return VIDEO_FILTER;
}

export function getVideoEncodeArgs(): string[] {
  return [
    '-c:v',
    'libx264',
    '-preset',
    'fast',
    '-crf',
    '23',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(OUTPUT_FPS),
  ];
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

export function getSkullAssetPath(): string {
  return path.resolve(process.cwd(), 'assets', 'skull.png');
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
