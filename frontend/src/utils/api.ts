import type { GenerateStatus } from '../types/video';
import type { TFunction } from '../i18n/I18nContext';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getApiBase(): string {
  if (import.meta.env.DEV && (!API_URL || API_URL.includes('localhost:4000'))) {
    return '';
  }
  return API_URL;
}

export type StatusCallback = (status: GenerateStatus) => void;

export function translateApiError(message: string, t: TFunction): string {
  const lower = message.toLowerCase();
  if (lower.includes('ffmpeg') || lower.includes('not installed')) {
    return t('errors.ffmpeg');
  }
  if (lower.includes('too many') || lower.includes('rate limit')) {
    return t('errors.tooManyRequests');
  }
  if (lower.includes('cannot reach') || lower.includes('fetch')) {
    return t('errors.serverUnreachable');
  }
  return message;
}

export async function generateVideo(
  files: File[],
  personName: string,
  onStatusChange: StatusCallback,
  t: TFunction,
): Promise<Blob> {
  const apiBase = getApiBase();
  if (!apiBase) {
    throw new Error(t('errors.apiNotConfigured'));
  }

  onStatusChange('uploading');

  const formData = new FormData();
  formData.append('personName', personName.trim());
  files.forEach((file) => formData.append('videos', file));

  onStatusChange('generating');

  let response: Response;
  try {
    response = await fetch(`${apiBase}/api/generate`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(t('errors.serverUnreachable'));
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const raw =
      (errorBody as { error?: string }).error ||
      `Generation failed (${response.status})`;
    throw new Error(translateApiError(raw, t));
  }

  onStatusChange('almost_done');
  return response.blob();
}
