import PageMeta from '../components/PageMeta';
import { useI18n } from '../i18n/I18nContext';

export default function ContactPage() {
  const { messages } = useI18n();
  const p = messages.contact;

  return (
    <article className="content-page">
      <PageMeta title={p.metaTitle} description={p.metaDescription} />
      <h1>{p.title}</h1>

      <section>
        <p>{p.intro}</p>
        <p>
          {p.emailLabel}{' '}
          <a href="mailto:hello@coregenerator.app">hello@coregenerator.app</a>
        </p>
        <p className="contact-note">{p.note}</p>
      </section>

      <section>
        <h2>{p.topicsTitle}</h2>
        <ul>
          {p.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
