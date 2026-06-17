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

      <section className="youtube-shorts-section">
        <h2>{p.youtubeTitle}</h2>
        <p>{p.youtubeLead}</p>
        <div className="youtube-shorts-grid">
          {p.youtubeShorts.map((video) => (
            <figure key={video.id} className="youtube-short-card">
              <div className="youtube-short-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.label}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption>
                <a
                  href={`https://www.youtube.com/shorts/${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.label}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
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
