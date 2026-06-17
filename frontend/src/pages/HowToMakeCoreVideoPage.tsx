import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import ContentNav from '../components/ContentNav';
import { useI18n } from '../i18n/I18nContext';

export default function HowToMakeCoreVideoPage() {
  const { messages } = useI18n();
  const p = messages.howTo;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="content-lead">{p.lead}</p>

      <ol className="step-list">
        {p.steps.map((step, i) => (
          <li key={step.title} className="step-list-item">
            <span className="step-list-num">{i + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <section>
        <h2>{p.techTitle}</h2>
        <ul>
          {p.techList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <p>
          {p.tipsText}{' '}
          <Link to="/tips-for-short-form-video">{p.tipsLink}</Link>.
        </p>
        <Link to="/" className="content-cta">{p.cta}</Link>
      </section>

      <ContentNav />
    </article>
  );
}
