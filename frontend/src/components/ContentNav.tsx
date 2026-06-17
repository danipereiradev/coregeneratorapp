import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

export default function ContentNav() {
  const { t } = useI18n();

  const links = [
    { to: '/what-is-a-core-video', label: t('nav.whatIs') },
    { to: '/how-to-make-a-core-video', label: t('nav.howTo') },
    { to: '/tips-for-short-form-video', label: t('nav.tips') },
    { to: '/examples', label: t('nav.examples') },
    { to: '/faq', label: t('nav.faq') },
  ];

  return (
    <nav className="content-nav" aria-label={t('contentNav.label')}>
      <p className="content-nav-label">{t('contentNav.label')}</p>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
