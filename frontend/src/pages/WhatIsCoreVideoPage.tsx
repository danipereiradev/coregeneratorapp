import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import ContentNav from '../components/ContentNav';
import { useI18n } from '../i18n/I18nContext';

export default function WhatIsCoreVideoPage() {
  const { messages } = useI18n();
  const p = messages.whatIs;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>
      <p className="content-lead">{p.lead}</p>

      {p.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.body && <p>{section.body}</p>}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <Link to="/" className="content-cta">{p.cta}</Link>
      <ContentNav />
    </article>
  );
}
