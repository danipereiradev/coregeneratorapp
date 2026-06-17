import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import ContentNav from '../components/ContentNav';
import { useI18n } from '../i18n/I18nContext';

export default function ExamplesPage() {
  const { messages } = useI18n();
  const p = messages.examples;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="content-lead">{p.lead}</p>

      <section>
        <h2>{p.structureTitle}</h2>
        <pre className="structure-block">{p.structureBlock}</pre>
        <p>{p.structureNote}</p>
      </section>

      <div className="examples-grid">
        {p.items.map((ex) => (
          <section key={ex.title} className="example-card">
            <h2>{ex.title}</h2>
            <p>{ex.desc}</p>
            <p className="example-structure"><strong>Flow:</strong> {ex.structure}</p>
          </section>
        ))}
      </div>

      <section>
        <h2>{p.tryTitle}</h2>
        <p>{p.tryText}</p>
        <Link to="/" className="content-cta">{p.cta}</Link>
      </section>

      <ContentNav />
    </article>
  );
}
