export type Locale = 'es' | 'en';

export interface FaqItem {
  q: string;
  a: string;
}

export interface StepItem {
  title: string;
  desc: string;
}

export interface TipItem {
  title: string;
  body: string;
}

export interface ExampleItem {
  title: string;
  desc: string;
  structure: string;
}

export interface LearnCard {
  title: string;
  desc: string;
}

export interface PrivacySection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface Translations {
  meta: {
    defaultTitle: string;
    defaultDescription: string;
  };
  lang: {
    label: string;
    es: string;
    en: string;
  };
  nav: {
    howItWorks: string;
    faq: string;
    guides: string;
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
    whatIs: string;
    howTo: string;
    tips: string;
    examples: string;
  };
  ad: { space: string };
  home: {
    metaTitle: string;
    metaDescription: string;
    subtitle: string;
    steps: StepItem[];
    startBtn: string;
    generatorTitle: string;
    personNameLabel: string;
    personNamePlaceholder: string;
    titlePreview: string;
    titlePreviewEmpty: string;
    resultReady: string;
    downloadBtn: string;
    learnTitle: string;
    learnCards: LearnCard[];
  };
  uploader: {
    dropTitle: string;
    dropHint: string;
    empty: string;
    summary: string;
    clip: string;
    clips: string;
    moveUp: string;
    moveDown: string;
    remove: string;
    skippedNonVideo: string;
  };
  generate: {
    idle: string;
    uploading: string;
    generating: string;
    almostDone: string;
  };
  validation: {
    minClips: string;
    maxClips: string;
    maxSize: string;
    notVideo: string;
    personNameRequired: string;
    personNameMax: string;
  };
  errors: {
    generic: string;
    serverUnreachable: string;
    ffmpeg: string;
    tooManyRequests: string;
  };
  footer: { copy: string };
  contentNav: { label: string };
  whatIs: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    sections: { title: string; body: string; list?: string[] }[];
    cta: string;
  };
  howTo: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    steps: StepItem[];
    techTitle: string;
    techList: string[];
    tipsText: string;
    tipsLink: string;
    cta: string;
  };
  tips: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    items: TipItem[];
    platformTitle: string;
    platformList: string[];
    cta: string;
  };
  examples: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    structureTitle: string;
    structureBlock: string;
    structureNote: string;
    items: ExampleItem[];
    tryTitle: string;
    tryText: string;
    cta: string;
  };
  faq: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    privacyLink: string;
    contactText: string;
    contactLink: string;
    whatIsLink: string;
    items: FaqItem[];
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    updated: string;
    sections: PrivacySection[];
  };
  terms: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    updated: string;
    sections: PrivacySection[];
  };
  contact: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    emailLabel: string;
    note: string;
    topicsTitle: string;
    topics: string[];
  };
}
