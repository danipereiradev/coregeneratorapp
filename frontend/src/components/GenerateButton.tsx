import type { GenerateStatus } from '../types/video';
import { useI18n } from '../i18n/I18nContext';

interface GenerateButtonProps {
  status: GenerateStatus;
  disabled: boolean;
  onClick: () => void;
}

const STATUS_KEYS: Partial<Record<GenerateStatus, string>> = {
  uploading: 'generate.uploading',
  generating: 'generate.generating',
  almost_done: 'generate.almostDone',
};

export default function GenerateButton({
  status,
  disabled,
  onClick,
}: GenerateButtonProps) {
  const { t } = useI18n();
  const isLoading = status === 'uploading' || status === 'generating' || status === 'almost_done';
  const label = isLoading && STATUS_KEYS[status] ? t(STATUS_KEYS[status]!) : t('generate.idle');

  return (
    <button
      type="button"
      className={`btn btn-primary btn-generate${isLoading ? ' btn-generate--loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && <span className="spinner" aria-hidden="true" />}
      {label}
    </button>
  );
}
