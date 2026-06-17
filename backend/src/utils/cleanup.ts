import fs from 'fs/promises';
import path from 'path';

export async function cleanupJobFolder(jobFolder: string): Promise<void> {
  try {
    await fs.rm(jobFolder, { recursive: true, force: true });
  } catch (err) {
    console.warn(`[cleanup] Failed to remove job folder ${jobFolder}:`, err);
  }
}

export function scheduleCleanup(jobFolder: string, delayMs = 60_000): void {
  setTimeout(() => {
    void cleanupJobFolder(jobFolder);
  }, delayMs);
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getTempRoot(): string {
  return path.resolve(process.cwd(), 'temp');
}
