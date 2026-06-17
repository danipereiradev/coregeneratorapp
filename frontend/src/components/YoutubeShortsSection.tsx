type YoutubeShort = {
  id: string;
  label: string;
};

type YoutubeShortsSectionProps = {
  title: string;
  lead: string;
  videos: YoutubeShort[];
  className?: string;
};

export default function YoutubeShortsSection({
  title,
  lead,
  videos,
  className = '',
}: YoutubeShortsSectionProps) {
  return (
    <section className={`youtube-shorts-section ${className}`.trim()}>
      <h2>{title}</h2>
      <p>{lead}</p>
      <div className="youtube-shorts-grid">
        {videos.map((video) => (
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
  );
}
