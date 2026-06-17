import type { VideoFileItem } from '../types/video';
import { formatFileSize } from '../utils/validation';
import { useI18n } from '../i18n/I18nContext';

interface VideoListProps {
  items: VideoFileItem[];
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function VideoList({
  items,
  onRemove,
  onMoveUp,
  onMoveDown,
}: VideoListProps) {
  const { t } = useI18n();

  if (items.length === 0) {
    return <p className="video-list-empty">{t('uploader.empty')}</p>;
  }

  return (
    <ul className="video-list">
      {items.map((item, index) => (
        <li key={item.id} className="video-list-item">
          <span className="video-list-order">{index + 1}</span>
          <div className="video-list-info">
            <span className="video-list-name">{item.name}</span>
            <span className="video-list-size">{formatFileSize(item.size)}</span>
          </div>
          <div className="video-list-actions">
            <button
              type="button"
              className="btn-icon"
              onClick={() => onMoveUp(item.id)}
              disabled={index === 0}
              aria-label={t('uploader.moveUp', { name: item.name })}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => onMoveDown(item.id)}
              disabled={index === items.length - 1}
              aria-label={t('uploader.moveDown', { name: item.name })}
            >
              ↓
            </button>
            <button
              type="button"
              className="btn-icon btn-icon--danger"
              onClick={() => onRemove(item.id)}
              aria-label={t('uploader.remove', { name: item.name })}
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
