import { useI18n } from '../i18n/I18nContext';

interface AdPlaceholderProps {
  variant?: 'banner' | 'sidebar' | 'inline';
}

export default function AdPlaceholder({ variant = 'banner' }: AdPlaceholderProps) {
  const { t } = useI18n();

  return (
    <div className={`ad-placeholder ad-placeholder--${variant}`} aria-hidden="true">
      <span>{t('ad.space')}</span>
    </div>
  );
}
