import { Link, Outlet } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  const { t } = useI18n();

  const guideLinks = [
    { to: '/what-is-a-core-video', label: t('nav.whatIs') },
    { to: '/how-to-make-a-core-video', label: t('nav.howTo') },
    { to: '/tips-for-short-form-video', label: t('nav.tips') },
    { to: '/examples', label: t('nav.examples') },
    { to: '/faq', label: t('nav.faq') },
  ];

  const legalLinks = [
    { to: '/privacy', label: t('nav.privacy') },
    { to: '/terms', label: t('nav.terms') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            CoreGenerator
          </Link>
          <div className="header-actions">
            <nav className="header-nav" aria-label="Main">
              <Link to="/how-to-make-a-core-video">{t('nav.howItWorks')}</Link>
              <Link to="/faq">{t('nav.faq')}</Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-col-title">{t('nav.guides')}</p>
            <nav className="footer-nav-col">
              {guideLinks.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </nav>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">{t('nav.legal')}</p>
            <nav className="footer-nav-col">
              {legalLinks.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </nav>
          </div>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} CoreGenerator. {t('footer.copy')}
        </p>
      </footer>
    </div>
  );
}
