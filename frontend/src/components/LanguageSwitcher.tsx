import { useI18n } from '../i18n/I18nContext';
import type { Locale } from '../i18n/types';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="lang-switcher">
      <label htmlFor="lang-select" className="lang-switcher-label">
        {t('lang.label')}
      </label>
      <select
        id="lang-select"
        className="lang-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t('lang.label')}
      >
        <option value="es">{t('lang.es')}</option>
        <option value="en">{t('lang.en')}</option>
      </select>
    </div>
  );
}
