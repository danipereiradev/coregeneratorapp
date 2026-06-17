import { useEffect } from 'react';

const DEFAULT_TITLE = 'CoreGenerator – Create CORE videos for TikTok, Reels & Shorts';
const DEFAULT_DESCRIPTION =
  'Upload clips, generate your CORE video, and download it for TikTok, Reels or Shorts.';

interface PageMetaProps {
  title: string;
  description?: string;
}

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) {
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      if (meta) {
        meta.setAttribute('content', DEFAULT_DESCRIPTION);
      }
    };
  }, [title, description]);

  return null;
}
