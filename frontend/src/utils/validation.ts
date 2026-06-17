import type { TFunction } from '../i18n/I18nContext';

export const MIN_CLIPS = 2;
export const MAX_CLIPS = 10;
export const MAX_TOTAL_BYTES = 200 * 1024 * 1024;
export const MAX_PERSON_NAME_LENGTH = 60;

const VIDEO_MIME_PREFIX = 'video/';

export function formatCoreTitle(personName: string): string {
  return `${personName.trim()} CORE`;
}

export function validatePersonName(name: string, t: TFunction): string | null {
  const trimmed = name.trim();
  if (!trimmed) return t('validation.personNameRequired');
  if (trimmed.length > MAX_PERSON_NAME_LENGTH) {
    return t('validation.personNameMax', { max: MAX_PERSON_NAME_LENGTH });
  }
  return null;
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith(VIDEO_MIME_PREFIX);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getTotalSizeMb(files: File[]): number {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  return Math.round((totalBytes / (1024 * 1024)) * 10) / 10;
}

export function validateClipSelection(
  files: File[],
  t: TFunction,
): string | null {
  if (files.length < MIN_CLIPS) {
    return t('validation.minClips', { min: MIN_CLIPS });
  }
  if (files.length > MAX_CLIPS) {
    return t('validation.maxClips', { max: MAX_CLIPS });
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > MAX_TOTAL_BYTES) {
    return t('validation.maxSize', { current: formatFileSize(totalSize) });
  }

  const nonVideo = files.find((f) => !isVideoFile(f));
  if (nonVideo) {
    return t('validation.notVideo', { name: nonVideo.name });
  }

  return null;
}
