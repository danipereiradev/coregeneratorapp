import type { Translations } from './types';

const en: Translations = {
  meta: {
    defaultTitle:
      'CoreGenerator – Create CORE videos for TikTok, Reels & Shorts',
    defaultDescription:
      'Upload clips, generate your CORE video, and download it for TikTok, Reels or Shorts.',
  },
  lang: { label: 'Language', es: 'Español', en: 'English' },
  nav: {
    howItWorks: 'How it works',
    faq: 'FAQ',
    guides: 'Guides',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    contact: 'Contact',
    whatIs: 'What is a CORE video?',
    howTo: 'How to make a CORE video',
    tips: 'Tips for TikTok / Reels / Shorts',
    examples: 'Examples',
  },
  ad: { space: 'Ad space' },
  home: {
    metaTitle:
      'CoreGenerator – Free CORE Video Maker for TikTok, Reels & Shorts',
    metaDescription:
      'Upload clips, add a name, and generate a CORE-style vertical video with boom transitions and title cards. Free, no login required.',
    subtitle:
      'Upload clips. Generate your CORE video. Download it for TikTok, Reels or Shorts.',
    steps: [
      {
        title: 'Upload your clips',
        desc: 'Add 2–10 short videos in the order you want.',
      },
      {
        title: 'Generate the CORE edit',
        desc: 'Add a name – it stays centered on screen throughout the video.',
      },
      {
        title: 'Download and share',
        desc: 'Get a vertical MP4 ready for TikTok, Reels or Shorts.',
      },
    ],
    startBtn: 'Start generating',
    generatorTitle: 'Create your CORE video',
    personNameLabel: 'Person name',
    personNamePlaceholder: 'e.g. Alex',
    titlePreview: 'Title preview:',
    titlePreviewEmpty: 'Your Name CORE',
    resultReady: 'Your CORE video is ready!',
    downloadBtn: 'Download video',
    learnTitle: 'Learn about CORE videos',
    learnCards: [
      {
        title: 'What is a CORE video?',
        desc: 'Understand the edit style, transitions, and why it works on short-form platforms.',
      },
      {
        title: 'How to make a CORE video',
        desc: 'Step-by-step guide from clip upload to download.',
      },
      {
        title: 'Tips for TikTok / Reels / Shorts',
        desc: 'Posting advice to get more views after you export.',
      },
      {
        title: 'Examples',
        desc: 'Sports, gaming, fitness, and lifestyle CORE structures.',
      },
      { title: 'FAQ', desc: 'Limits, formats, privacy, and common questions.' },
      {
        title: 'Privacy Policy',
        desc: 'How we handle your uploads, analytics, and cookies.',
      },
    ],
  },
  uploader: {
    dropTitle: 'Drop video clips here or click to browse',
    dropHint: '2–10 clips · MP4, MOV, WebM · max 200 MB total',
    empty: 'No clips selected yet.',
    summary: '{{count}} {{unit}} · {{size}}',
    clip: 'clip',
    clips: 'clips',
    moveUp: 'Move {{name}} up',
    moveDown: 'Move {{name}} down',
    remove: 'Remove {{name}}',
    skippedNonVideo: 'Only video files allowed. Skipped: {{names}}',
  },
  generate: {
    idle: 'Generate CORE',
    uploading: 'Uploading clips…',
    generating: 'Generating video…',
    almostDone: 'Almost done…',
  },
  validation: {
    minClips: 'Please upload at least {{min}} video clips.',
    maxClips: 'Maximum {{max}} video clips allowed.',
    maxSize: 'Total upload size must not exceed 200 MB (current: {{current}}).',
    notVideo: '"{{name}}" is not a valid video file.',
    personNameRequired: 'Please enter a person name for the CORE title.',
    personNameMax: 'Name must be {{max}} characters or fewer.',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    apiNotConfigured:
      'The API is not configured. In Vercel, set VITE_API_URL to your Railway URL and redeploy.',
    serverUnreachable:
      'Cannot reach the API server. Check your connection or try again later.',
    ffmpeg: 'FFmpeg is not installed on the server.',
    processingFailed:
      'Video processing failed. Try shorter clips or fewer files.',
    tooManyRequests:
      'Too many requests. Please wait a few minutes and try again.',
  },
  footer: {
    copy: 'Free to use.',
    registered: 'Registered and free app.',
    developerAria: 'Website developed by danipereiraweb.es',
  },
  contentNav: { label: 'Guides' },
  whatIs: {
    metaTitle: 'What is a CORE Video? – CoreGenerator',
    metaDescription:
      'Learn what a CORE video edit is and how CoreGenerator helps you make them for free.',
    title: 'What is a CORE video?',
    lead: 'A CORE video is a fast-paced short-form edit built from multiple clips, with loud transitions, bold title cards, and vertical format for TikTok, Reels, and Shorts.',
    sections: [
      {
        title: 'The CORE editing style',
        body: 'CORE edits feel intense and easy to watch. Several moments are stitched together with black screens or title cards and deep boom sounds between clips.',
      },
      {
        title: 'What makes it recognizable?',
        body: '',
        list: [
          'Multiple clips (usually 2 to 10) in clear order.',
          'Vertical 9:16 format (1080×1920).',
          '2-second black title cards between clips.',
          'Boom sound on each transition.',
          'Fast pacing with no slow intros.',
        ],
      },
      {
        title: 'Who uses it?',
        body: 'Sports highlights, gaming, gym edits, travel montages, and fan edits — whenever you have strong clips and want a shareable result quickly.',
      },
      {
        title: 'Make one with CoreGenerator',
        body: 'CoreGenerator normalizes clips, inserts title cards with your chosen name, adds boom sounds, and exports a vertical MP4.',
      },
    ],
    cta: 'Start generating →',
  },
  howTo: {
    metaTitle: 'How to Make a CORE Video – Step-by-Step | CoreGenerator',
    metaDescription:
      'Step-by-step guide to making a CORE video online with CoreGenerator.',
    title: 'How to make a CORE video',
    lead: 'Follow these four steps to create a vertical CORE edit in your browser.',
    steps: [
      {
        title: 'Collect your clips',
        desc: 'Choose 2 to 10 short videos. Portrait works best; landscape is cropped to vertical.',
      },
      {
        title: 'Upload in order',
        desc: 'Add files in sequence. Reorder with up/down buttons before generating.',
      },
      {
        title: 'Enter the person name',
        desc: 'Shown as "Name CORE" centered on screen for the whole video.',
      },
      {
        title: 'Generate and download',
        desc: 'Click Generate CORE, then download the MP4 for TikTok, Reels, or Shorts.',
      },
    ],
    techTitle: 'Technical requirements',
    techList: [
      '2 to 10 videos per project',
      'Maximum 200 MB total upload',
      'Formats: MP4, MOV, WebM',
      'Output: MP4 1080×1920, 30 fps, H.264 + AAC',
    ],
    tipsText: 'Use clips with similar energy. Read our',
    tipsLink: 'tips for TikTok, Reels, and Shorts',
    cta: 'Create your CORE video →',
  },
  tips: {
    metaTitle: 'Tips for TikTok, Reels & Shorts – CoreGenerator',
    metaDescription: 'Practical tips for posting CORE-style vertical videos.',
    title: 'Tips for TikTok, Reels & Shorts',
    lead: 'A good CORE edit is only half the job. These tips help after you download.',
    items: [
      {
        title: 'Hook in the first second',
        body: 'Start with your strongest clip.',
      },
      {
        title: 'Keep clips short',
        body: 'Trim long footage before uploading.',
      },
      { title: 'Use vertical video', body: 'CoreGenerator exports 9:16 MP4.' },
      {
        title: 'Match audio energy',
        body: 'Lower clip volume if music is already loud.',
      },
      { title: 'Clear title name', body: 'The card shows "Your Name CORE".' },
      {
        title: 'Add a caption',
        body: 'Platforms need context in text or on-screen hooks.',
      },
      {
        title: 'Post consistently',
        body: 'Batch several edits across the week.',
      },
      {
        title: 'Platform safe zones',
        body: 'Leave space for UI overlays when filming details.',
      },
    ],
    platformTitle: 'Platform notes',
    platformList: [
      'TikTok – fast cuts and trending sounds in caption strategy.',
      'Instagram Reels – thumbnails and hashtags help discovery.',
      'YouTube Shorts – title and description matter for search.',
    ],
    cta: 'Read the step-by-step guide →',
  },
  examples: {
    metaTitle: 'CORE Video Examples – CoreGenerator',
    metaDescription:
      'Example CORE video structures for sports, gaming, fitness, and lifestyle.',
    title: 'CORE video examples',
    lead: 'Every CORE edit follows: clip → 2s black title card with boom → clip.',
    structureTitle: 'Standard structure',
    structureBlock: `[Clip 1]
   ↓
[2s title: "Alex CORE" + boom]
   ↓
[Clip 2]
   …`,
    structureNote:
      'With 3 clips you get 2 transitions. Total length = clips + 2s per transition.',
    items: [
      {
        title: 'Sports highlight CORE',
        desc: '3–6 clips of goals or saves. Player name on the title card.',
        structure: 'Clip → Title + boom → Clip → Title + boom → Clip',
      },
      {
        title: 'Gym / fitness CORE',
        desc: 'Short lift clips and PR moments.',
        structure: 'Warm-up → Transition → Lift → Transition → Celebration',
      },
      {
        title: 'Gaming montage CORE',
        desc: 'Kills and clutches with your gamertag.',
        structure: 'Play 1 → Transition → Play 2 → Transition → Play 3',
      },
      {
        title: 'Travel / lifestyle CORE',
        desc: 'Quick scenery and friends. Keep clips under 3 seconds.',
        structure: 'Scene A → Transition → Scene B → Transition → Scene C',
      },
    ],
    tryTitle: 'Try it yourself',
    tryText:
      'Upload clips and enter a name — CoreGenerator builds this structure automatically.',
    cta: 'Generate your example →',
  },
  faq: {
    metaTitle: 'FAQ – CoreGenerator',
    metaDescription: 'Frequently asked questions about CoreGenerator.',
    title: 'Frequently asked questions',
    lead: 'Quick answers. For privacy details, read our',
    privacyLink: 'Privacy Policy',
    contactText: 'Still have questions?',
    contactLink: 'Contact us',
    whatIsLink: 'what a CORE video is',
    items: [
      {
        q: 'What is CoreGenerator?',
        a: 'A free online tool that stitches clips into a CORE-style vertical edit with title cards and boom sounds.',
      },
      {
        q: 'Is it free?',
        a: 'Yes. No login, payment, or subscription required.',
      },
      {
        q: 'How many clips can I upload?',
        a: 'Between 2 and 10 per generation. Max 200 MB total.',
      },
      {
        q: 'What format is the download?',
        a: 'MP4 1080×1920, 30 fps, H.264 + AAC — compatible with TikTok, Reels, and Shorts.',
      },
      {
        q: 'What does the title card show?',
        a: 'You enter a name; it appears as "Name CORE" centered on screen for the entire video.',
      },
      {
        q: 'Do you store my videos?',
        a: 'No. Files are processed temporarily and deleted after generation.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. Works in the browser; you only need your clip files.',
      },
      {
        q: 'Can I use copyrighted music?',
        a: 'You are responsible for your content and must have rights to use it.',
      },
      {
        q: 'Why did generation fail?',
        a: 'Common causes: invalid format, too few clips, size over 200 MB, or server error. Try MP4.',
      },
      {
        q: 'Will there be ads?',
        a: 'We may add Google AdSense later and will update the Privacy Policy first.',
      },
    ],
  },
  privacy: {
    metaTitle: 'Privacy Policy – CoreGenerator',
    metaDescription:
      'CoreGenerator Privacy Policy: uploads, cookies, Analytics, AdSense, and your rights.',
    title: 'Privacy Policy',
    updated: 'Last updated: June 17, 2026',
    sections: [
      {
        title: '1. Introduction',
        paragraphs: [
          'CoreGenerator is a free web tool for creating CORE-style videos. This policy explains what we collect and how we use it.',
          'We do not require accounts and do not sell personal data.',
        ],
      },
      {
        title: '2. Data controller',
        paragraphs: [
          'Privacy inquiries: hello@coregenerator.app or our Contact page.',
        ],
      },
      {
        title: '3. Information we collect',
        paragraphs: [
          'Uploaded videos are transmitted for processing only.',
          'We may collect analytics data via Google Analytics 4 when enabled.',
          'Cookies may be used for functionality and analytics.',
        ],
        list: [
          'No mandatory registration',
          'No payment data',
          'No permanent storage of uploads',
        ],
      },
      {
        title: '4. How we use information',
        paragraphs: [],
        list: [
          'Process your CORE video',
          'Protect the service from abuse',
          'Improve the site with analytics',
          'Display ads if AdSense is enabled',
        ],
      },
      {
        title: '5. Video retention',
        paragraphs: [
          'Uploads are stored temporarily during processing and deleted shortly after download, usually within minutes.',
        ],
      },
      {
        title: '6. Third-party services',
        paragraphs: [
          'Google Analytics 4 and potential future Google AdSense. See Google privacy policies.',
        ],
      },
      {
        title: '7. Your rights',
        paragraphs: [
          'You may request access, correction, or deletion depending on your jurisdiction. Contact hello@coregenerator.app.',
        ],
      },
      {
        title: '8. Children',
        paragraphs: [
          'Not directed at children under 13. Contact us to delete any child data.',
        ],
      },
      {
        title: '9. Security',
        paragraphs: [
          'We use HTTPS, upload limits, rate limiting, and temp file cleanup.',
        ],
      },
      {
        title: '10. Changes',
        paragraphs: [
          'We may update this policy. The date above shows the latest revision.',
        ],
      },
    ],
  },
  terms: {
    metaTitle: 'Terms of Use – CoreGenerator',
    metaDescription: 'CoreGenerator Terms of Use.',
    title: 'Terms of Use',
    updated: 'Last updated: June 17, 2026',
    sections: [
      {
        title: 'Acceptance',
        paragraphs: ['By using CoreGenerator you agree to these terms.'],
      },
      {
        title: 'Service',
        paragraphs: ['Free tool provided "as is" without warranties.'],
      },
      {
        title: 'Your content',
        paragraphs: ['You must have rights to the videos you upload.'],
      },
      {
        title: 'Acceptable use',
        paragraphs: [],
        list: [
          'No infringing content',
          'No service abuse',
          'No automated API abuse',
        ],
      },
      {
        title: 'Liability',
        paragraphs: ['We are not liable for losses from failed generations.'],
      },
      {
        title: 'Changes',
        paragraphs: ['We may update these terms at any time.'],
      },
      {
        title: 'Contact',
        paragraphs: ['hello@coregenerator.app or Contact page.'],
      },
    ],
  },
  contact: {
    metaTitle: 'Contact – CoreGenerator',
    metaDescription: 'Contact CoreGenerator.',
    title: 'Contact',
    intro: 'Questions, feedback, or issues? We would love to hear from you.',
    emailLabel: 'Email:',
    note: 'We usually reply within 2–5 business days.',
    topicsTitle: 'Common topics',
    topics: [
      'Bug reports or failed generations',
      'Privacy questions',
      'Feature suggestions',
      'Advertising inquiries',
    ],
  },
};

export default en;
