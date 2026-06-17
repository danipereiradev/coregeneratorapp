import { useI18n } from '../i18n/I18nContext';

interface AdPlaceholderProps {
  variant?: 'banner' | 'sidebar' | 'inline';
}

const ADS_ENABLED = import.meta.env.VITE_ENABLE_ADS === 'true';

export default function AdPlaceholder({ variant = 'banner' }: AdPlaceholderProps) {
  const { t } = useI18n();

  if (!ADS_ENABLED) return null;

  return (
    <div className={`ad-placeholder ad-placeholder--${variant}`} aria-hidden="true">
      <span>{t('ad.space')}</span>
    </div>
  );
}
