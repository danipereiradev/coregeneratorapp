import { useState } from 'react';
import type { VideoFileItem } from '../types/video';
import { formatFileSize } from '../utils/validation';
import { useI18n } from '../i18n/I18nContext';

interface VideoListProps {
  items: VideoFileItem[];
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
}

export default function VideoList({
  items,
  onRemove,
  onMoveUp,
  onMoveDown,
  onReorder,
  disabled = false,
}: VideoListProps) {
  const { t } = useI18n();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="video-list-empty">{t('uploader.empty')}</p>;
  }

  const finishDrag = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      finishDrag();
      return;
    }

    const fromIndex = items.findIndex((i) => i.id === draggedId);
    const toIndex = items.findIndex((i) => i.id === targetId);
    if (fromIndex >= 0 && toIndex >= 0) {
      onReorder(fromIndex, toIndex);
    }
    finishDrag();
  };

  return (
    <div className="video-list-wrap">
      {items.length > 1 && !disabled && (
        <p className="video-list-hint">{t('uploader.reorderHint')}</p>
      )}
      <ul className="video-list">
        {items.map((item, index) => {
          const isDragging = draggedId === item.id;
          const isDropTarget = dropTargetId === item.id && draggedId !== item.id;

          return (
            <li
              key={item.id}
              className={[
                'video-list-item',
                isDragging ? 'video-list-item--dragging' : '',
                isDropTarget ? 'video-list-item--drop-target' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onDragOver={(e) => {
                if (disabled || !draggedId || draggedId === item.id) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDropTargetId(item.id);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                if (dropTargetId === item.id) setDropTargetId(null);
              }}
              onDrop={(e) => {
                if (disabled) return;
                e.preventDefault();
                handleDrop(item.id);
              }}
            >
              {!disabled && (
                <span
                  className="video-list-drag-handle"
                  draggable
                  aria-label={t('uploader.dragHandle', { name: item.name })}
                  onDragStart={(e) => {
                    setDraggedId(item.id);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.id);
                  }}
                  onDragEnd={finishDrag}
                >
                  ⋮⋮
                </span>
              )}
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
                  disabled={disabled || index === 0}
                  aria-label={t('uploader.moveUp', { name: item.name })}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => onMoveDown(item.id)}
                  disabled={disabled || index === items.length - 1}
                  aria-label={t('uploader.moveDown', { name: item.name })}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="btn-icon btn-icon--danger"
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                  aria-label={t('uploader.remove', { name: item.name })}
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
