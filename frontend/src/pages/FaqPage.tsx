import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import ContentNav from '../components/ContentNav';
import { useI18n } from '../i18n/I18nContext';

export default function FaqPage() {
  const { messages } = useI18n();
  const p = messages.faq;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="content-lead">
        {p.lead}{' '}
        <Link to="/privacy">{p.privacyLink}</Link>.
      </p>

      <dl className="faq-list">
        {p.items.map((item) => (
          <div key={item.q} className="faq-item">
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>

      <section>
        <p>
          {p.contactText}{' '}
          <Link to="/contact">{p.contactLink}</Link>{' '}
          · <Link to="/what-is-a-core-video">{p.whatIsLink}</Link>.
        </p>
      </section>

      <ContentNav />
    </article>
  );
}
