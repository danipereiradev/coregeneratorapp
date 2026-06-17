import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GenerateStatus, VideoFileItem } from '../types/video';
import AdPlaceholder from '../components/AdPlaceholder';
import VideoUploader from '../components/VideoUploader';
import GenerateButton from '../components/GenerateButton';
import PageMeta from '../components/PageMeta';
import { generateVideo, translateApiError } from '../utils/api';
import { getTotalSizeMb, validateClipSelection, validatePersonName, formatCoreTitle } from '../utils/validation';
import { trackEvent } from '../utils/analytics';
import { useI18n } from '../i18n/I18nContext';

const LEARN_ROUTES = [
  '/what-is-a-core-video',
  '/how-to-make-a-core-video',
  '/tips-for-short-form-video',
  '/examples',
  '/faq',
  '/privacy',
] as const;

export default function HomePage() {
  const { t, messages } = useI18n();
  const generatorRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<VideoFileItem[]>([]);
  const [personName, setPersonName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetResult = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setGenerateError(null);
    setStatus('idle');
  };

  const handleGenerate = async () => {
    const files = items.map((i) => i.file);
    const validationError = validateClipSelection(files, t);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const personValidation = validatePersonName(personName, t);
    if (personValidation) {
      setNameError(personValidation);
      return;
    }
    setNameError(null);

    resetResult();
    setStatus('uploading');

    trackEvent('generate_started', {
      clips_count: files.length,
      total_size_mb: getTotalSizeMb(files),
    });

    try {
      const blob = await generateVideo(files, personName, setStatus, t);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
      trackEvent('generate_success', { clips_count: files.length });
    } catch (err) {
      const raw = err instanceof Error ? err.message : t('errors.generic');
      const message = translateApiError(raw, t);
      setGenerateError(message);
      setStatus('error');
      trackEvent('generate_error', { message });
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    trackEvent('download_clicked', { clips_count: items.length });
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'core-video.mp4';
    a.click();
  };

  const isGenerating =
    status === 'uploading' || status === 'generating' || status === 'almost_done';

  return (
    <div className="home-page">
      <PageMeta title={t('home.metaTitle')} description={t('home.metaDescription')} />
      <AdPlaceholder variant="banner" />

      <div className="home-layout">
        <div className="home-content">
          <section className="hero">
            <h1>CoreGenerator</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>

            <div className="steps">
              {messages.home.steps.map((step, i) => (
                <div key={step.title} className="step-card">
                  <span className="step-num">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn btn-primary btn-hero" onClick={scrollToGenerator}>
              {t('home.startBtn')}
            </button>
          </section>

          <section className="generator" ref={generatorRef} id="generator">
            <h2>{t('home.generatorTitle')}</h2>

            <VideoUploader
              items={items}
              onChange={(next) => {
                setItems(next);
                resetResult();
              }}
              error={uploadError}
              onError={setUploadError}
              disabled={isGenerating}
            />

            <div className="person-name-field">
              <label htmlFor="person-name">{t('home.personNameLabel')}</label>
              <input
                id="person-name"
                type="text"
                className="text-input"
                placeholder={t('home.personNamePlaceholder')}
                value={personName}
                maxLength={60}
                disabled={isGenerating}
                onChange={(e) => {
                  setPersonName(e.target.value);
                  setNameError(null);
                  resetResult();
                }}
              />
              <p className="field-hint">
                {t('home.titlePreview')}{' '}
                <span className="title-preview">
                  {personName.trim() ? formatCoreTitle(personName) : t('home.titlePreviewEmpty')}
                </span>
              </p>
              {nameError && <p className="form-error" role="alert">{nameError}</p>}
            </div>

            <div className="generate-actions">
              <GenerateButton
                status={status}
                disabled={items.length < 2 || !personName.trim()}
                onClick={handleGenerate}
              />
            </div>

            {generateError && <p className="form-error" role="alert">{generateError}</p>}

            {status === 'success' && downloadUrl && (
              <div className="result-panel">
                <p className="result-success">{t('home.resultReady')}</p>
                <button type="button" className="btn btn-secondary" onClick={handleDownload}>
                  {t('home.downloadBtn')}
                </button>
                <AdPlaceholder variant="inline" />
              </div>
            )}
          </section>
        </div>

        <aside className="home-sidebar">
          <AdPlaceholder variant="sidebar" />
        </aside>
      </div>

      <section className="home-learn">
        <h2>{t('home.learnTitle')}</h2>
        <div className="home-learn-grid">
          {messages.home.learnCards.map((card, i) => (
            <Link key={card.title} to={LEARN_ROUTES[i]} className="learn-card">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
