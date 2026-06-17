import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import ContentNav from '../components/ContentNav';
import { useI18n } from '../i18n/I18nContext';

export default function TipsPage() {
  const { messages } = useI18n();
  const p = messages.tips;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="content-lead">{p.lead}</p>

      <div className="tips-grid">
        {p.items.map((tip) => (
          <section key={tip.title} className="tip-card">
            <h2>{tip.title}</h2>
            <p>{tip.body}</p>
          </section>
        ))}
      </div>

      <section>
        <h2>{p.platformTitle}</h2>
        <ul>
          {p.platformList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <Link to="/how-to-make-a-core-video" className="content-cta">{p.cta}</Link>
      <ContentNav />
    </article>
  );
}
