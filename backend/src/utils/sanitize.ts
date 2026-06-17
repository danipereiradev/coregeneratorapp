import path from 'path';
import { MAX_PERSON_NAME_LENGTH } from '../types/index.js';

const UNSAFE_CHARS = /[^a-zA-Z0-9._-]/g;

export function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase().replace(UNSAFE_CHARS, '');
  const base = path.basename(originalName, path.extname(originalName));
  const safeBase = base.replace(UNSAFE_CHARS, '_').slice(0, 80) || 'clip';
  const safeExt = ext && ext.startsWith('.') ? ext : '.mp4';
  return `${safeBase}${safeExt}`;
}

export function isVideoMimeType(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function isVideoExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v'].includes(ext);
}

export function isAllowedVideoFile(mimeType: string, filename: string): boolean {
  return isVideoMimeType(mimeType) || isVideoExtension(filename);
}

export function sanitizePersonName(raw: string): string {
  return raw
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '')
    .slice(0, MAX_PERSON_NAME_LENGTH);
}

export function validatePersonName(raw: string): string | null {
  const name = sanitizePersonName(raw);
  if (!name) {
    return 'Please enter a person name for the CORE title.';
  }
  if (name.length > MAX_PERSON_NAME_LENGTH) {
    return `Name must be ${MAX_PERSON_NAME_LENGTH} characters or fewer.`;
  }
  return null;
}

export function formatCoreTitle(personName: string): string {
  return `${sanitizePersonName(personName)} CORE 💀`;
}
