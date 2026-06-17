import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { useI18n } from '../i18n/I18nContext';

export default function TermsPage() {
  const { messages } = useI18n();
  const p = messages.terms;

  return (
    <article className="content-page content-page--legal">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="legal-updated">{p.updated}</p>

      {p.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section>
        <p>
          <Link to="/contact">{messages.nav.contact}</Link>
        </p>
      </section>
    </article>
  );
}
