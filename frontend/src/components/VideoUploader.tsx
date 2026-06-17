import { useRef } from 'react';
import type { VideoFileItem } from '../types/video';
import {
  MAX_CLIPS,
  formatFileSize,
  getTotalSizeMb,
  isVideoFile,
  validateClipSelection,
} from '../utils/validation';
import { trackEvent } from '../utils/analytics';
import { useI18n } from '../i18n/I18nContext';
import VideoList from './VideoList';

interface VideoUploaderProps {
  items: VideoFileItem[];
  onChange: (items: VideoFileItem[]) => void;
  error: string | null;
  onError: (message: string | null) => void;
  disabled?: boolean;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function VideoUploader({
  items,
  onChange,
  error,
  onError,
  disabled = false,
}: VideoUploaderProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const rejected = incoming.filter((f) => !isVideoFile(f));

    if (rejected.length > 0) {
      onError(
        t('uploader.skippedNonVideo', {
          names: rejected.map((f) => f.name).join(', '),
        }),
      );
    } else {
      onError(null);
    }

    const valid = incoming.filter(isVideoFile);
    const newItems: VideoFileItem[] = valid.map((file) => ({
      id: createId(),
      file,
      name: file.name,
      size: file.size,
    }));

    const combined = [...items, ...newItems];
    if (combined.length > MAX_CLIPS) {
      onError(t('validation.maxClips', { max: MAX_CLIPS }));
      return;
    }

    const validationError = validateClipSelection(combined.map((i) => i.file), t);
    if (validationError) {
      onError(validationError);
      return;
    }

    onChange(combined);

    trackEvent('files_selected', {
      clips_count: combined.length,
      total_size_mb: getTotalSizeMb(combined.map((i) => i.file)),
    });
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
    onError(null);
  };

  const handleMoveUp = (id: string) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const handleMoveDown = (id: string) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0 || idx >= items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  const totalSize = items.reduce((sum, i) => sum + i.size, 0);
  const unit = items.length === 1 ? t('uploader.clip') : t('uploader.clips');

  return (
    <div className="video-uploader">
      <div
        className={`drop-zone${disabled ? ' drop-zone--disabled' : ''}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
      >
        <p className="drop-zone-title">{t('uploader.dropTitle')}</p>
        <p className="drop-zone-hint">{t('uploader.dropHint')}</p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          hidden
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <VideoList
        items={items}
        onRemove={handleRemove}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onReorder={handleReorder}
        disabled={disabled}
      />

      {items.length > 0 && (
        <p className="upload-summary">
          {t('uploader.summary', {
            count: items.length,
            unit,
            size: formatFileSize(totalSize),
          })}
        </p>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
