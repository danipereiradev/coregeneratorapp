import type { Translations } from './types';

const es: Translations = {
  meta: {
    defaultTitle:
      'CoreGenerator – Crea vídeos CORE para TikTok, Reels y Shorts',
    defaultDescription:
      'Sube clips, genera tu vídeo CORE y descárgalo para TikTok, Reels o Shorts.',
  },
  lang: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
  },
  nav: {
    howItWorks: 'Cómo funciona',
    faq: 'FAQ',
    guides: 'Guías',
    legal: 'Legal',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    whatIs: '¿Qué es un vídeo CORE?',
    howTo: 'Cómo hacer un vídeo CORE',
    tips: 'Tips para TikTok / Reels / Shorts',
    examples: 'Ejemplos',
  },
  ad: { space: 'Espacio publicitario' },
  home: {
    metaTitle: 'CoreGenerator – Generador gratis de vídeos CORE',
    metaDescription:
      'Sube clips, añade un nombre y genera un vídeo vertical estilo CORE con transiciones boom y tarjetas de título. Gratis, sin registro.',
    subtitle:
      'Sube clips. Genera tu vídeo CORE. Descárgalo para TikTok, Reels o Shorts.',
    steps: [
      {
        title: 'Sube tus clips',
        desc: 'Añade entre 2 y 10 vídeos cortos en el orden que quieras.',
      },
      {
        title: 'Genera el edit CORE',
        desc: 'Pon un nombre: aparece centrado en pantalla durante todo el vídeo.',
      },
      {
        title: 'Descarga y comparte',
        desc: 'Obtén un MP4 vertical listo para TikTok, Reels o Shorts.',
      },
    ],
    startBtn: 'Empezar a generar',
    generatorTitle: 'Crea tu vídeo CORE',
    personNameLabel: 'Nombre de la persona',
    personNamePlaceholder: 'ej. Alex',
    titlePreview: 'Vista previa del título:',
    titlePreviewEmpty: 'Tu Nombre CORE',
    resultReady: '¡Tu vídeo CORE está listo!',
    downloadBtn: 'Descargar vídeo',
    learnTitle: 'Aprende sobre los vídeos CORE',
    learnCards: [
      {
        title: '¿Qué es un vídeo CORE?',
        desc: 'Entiende el estilo, las transiciones y por qué funciona en redes.',
      },
      {
        title: 'Cómo hacer un vídeo CORE',
        desc: 'Guía paso a paso desde la subida hasta la descarga.',
      },
      {
        title: 'Tips para TikTok / Reels / Shorts',
        desc: 'Consejos para publicar y conseguir más vistas.',
      },
      {
        title: 'Ejemplos',
        desc: 'Estructuras CORE para deporte, gaming, gym y lifestyle.',
      },
      { title: 'FAQ', desc: 'Límites, formatos, privacidad y dudas comunes.' },
      {
        title: 'Política de privacidad',
        desc: 'Cómo tratamos tus subidas, analítica y cookies.',
      },
    ],
  },
  uploader: {
    dropTitle: 'Arrastra vídeos aquí o haz clic para buscar',
    dropHint: '2–10 clips · MP4, MOV, WebM · máx. 200 MB en total',
    empty: 'Aún no hay clips seleccionados.',
    summary: '{{count}} {{unit}} · {{size}}',
    clip: 'clip',
    clips: 'clips',
    moveUp: 'Subir {{name}}',
    moveDown: 'Bajar {{name}}',
    remove: 'Eliminar {{name}}',
    skippedNonVideo: 'Solo se permiten vídeos. Omitidos: {{names}}',
  },
  generate: {
    idle: 'Generar CORE',
    uploading: 'Subiendo clips…',
    generating: 'Generando vídeo…',
    almostDone: 'Casi listo…',
  },
  validation: {
    minClips: 'Sube al menos {{min}} clips de vídeo.',
    maxClips: 'Máximo {{max}} clips de vídeo.',
    maxSize: 'El tamaño total no puede superar 200 MB (actual: {{current}}).',
    notVideo: '"{{name}}" no es un archivo de vídeo válido.',
    personNameRequired:
      'Introduce el nombre de la persona para el título CORE.',
    personNameMax: 'El nombre debe tener {{max}} caracteres o menos.',
  },
  errors: {
    generic: 'Algo ha fallado. Inténtalo de nuevo.',
    apiNotConfigured:
      'La API no está configurada. En Vercel, define VITE_API_URL con la URL de Railway y vuelve a desplegar.',
    serverUnreachable:
      'No se puede conectar al servidor de la API. Comprueba tu conexión o inténtalo más tarde.',
    ffmpeg: 'FFmpeg no está instalado en el servidor.',
    processingFailed:
      'No se pudo procesar el vídeo. Prueba con clips más cortos o menos archivos.',
    tooManyRequests:
      'Demasiadas peticiones. Espera unos minutos e inténtalo de nuevo.',
  },
  footer: {
    copy: 'Gratis para usar.',
    registered: 'App registrada y gratuita.',
    developerAria: 'Web desarrollada por danipereiraweb.es',
  },
  contentNav: { label: 'Guías' },
  whatIs: {
    metaTitle: '¿Qué es un vídeo CORE? – CoreGenerator',
    metaDescription:
      'Qué es un edit CORE, por qué usan boom y tarjetas de título, y cómo crearlo gratis con CoreGenerator.',
    title: '¿Qué es un vídeo CORE?',
    lead: 'Un vídeo CORE es un montaje rápido de varios clips con transiciones fuertes, tarjetas de título y formato vertical para TikTok, Reels y Shorts.',
    sections: [
      {
        title: 'El estilo CORE',
        body: 'Los edits CORE triunfan en vídeo corto porque son intensos y fáciles de ver. En lugar de un clip largo, se unen varios momentos. Entre cada uno suele haber una pantalla negra o tarjeta con un "boom" grave. El resultado es rítmico y pensado para captar atención al instante.',
      },
      {
        title: '¿Qué lo hace reconocible?',
        body: '',
        list: [
          'Varios clips (normalmente 2 a 10) en orden claro.',
          'Formato vertical 9:16 (1080×1920).',
          'Cortinillas negras de 2 s con título entre clips.',
          'Sonido boom en cada transición.',
          'Ritmo rápido, sin intros lentas.',
        ],
      },
      {
        title: '¿Quién lo usa?',
        body: 'Highlights deportivos, gaming, gym, viajes, compilaciones de amigos y fan edits. Funciona cuando tienes varios clips buenos y quieres algo compartible sin pasar horas en un editor de escritorio.',
      },
      {
        title: 'Créalo con CoreGenerator',
        body: 'CoreGenerator es una herramienta gratuita en el navegador que normaliza tus clips, inserta tarjetas con el nombre que elijas, añade boom y exporta un MP4 vertical listo para subir.',
      },
    ],
    cta: 'Empezar a generar →',
  },
  howTo: {
    metaTitle: 'Cómo hacer un vídeo CORE – Guía paso a paso',
    metaDescription:
      'Guía para crear un vídeo CORE online: sube clips, pon un nombre, genera transiciones con boom y descarga para TikTok, Reels o Shorts.',
    title: 'Cómo hacer un vídeo CORE',
    lead: 'No necesitas software profesional. Sigue estos cuatro pasos para crear un edit CORE vertical en el navegador.',
    steps: [
      {
        title: 'Reúne tus clips',
        desc: 'Elige entre 2 y 10 vídeos cortos. Los verticales funcionan mejor, pero CoreGenerator recorta los horizontales a vertical.',
      },
      {
        title: 'Súbelos en orden',
        desc: 'Añade los archivos en la secuencia deseada. Usa las flechas arriba/abajo para reordenar antes de generar.',
      },
      {
        title: 'Introduce el nombre',
        desc: 'Escribe el nombre para la tarjeta. Se muestra como "Nombre CORE" centrado en todo el vídeo.',
      },
      {
        title: 'Genera y descarga',
        desc: 'Pulsa Generar CORE. Cuando termine, descarga el MP4 y publícalo en TikTok, Reels o Shorts.',
      },
    ],
    techTitle: 'Requisitos técnicos',
    techList: [
      'Entre 2 y 10 vídeos por proyecto',
      'Máximo 200 MB de subida total',
      'Formatos: MP4, MOV, WebM',
      'Salida: MP4 1080×1920, 30 fps, H.264 + AAC',
    ],
    tipsText: 'Usa clips con energía similar y nombres claros. Lee nuestros',
    tipsLink: 'tips para TikTok, Reels y Shorts',
    cta: 'Crear tu vídeo CORE →',
  },
  tips: {
    metaTitle: 'Tips para TikTok, Reels y Shorts – CoreGenerator',
    metaDescription:
      'Consejos prácticos para publicar vídeos CORE verticales en TikTok, Instagram Reels y YouTube Shorts.',
    title: 'Tips para TikTok, Reels y Shorts',
    lead: 'Un buen edit CORE es solo la mitad. Estos consejos ayudan a que tu vídeo rinda mejor después de descargarlo.',
    items: [
      {
        title: 'Engancha en el primer segundo',
        body: 'Empieza con tu clip más fuerte, no con una introducción lenta.',
      },
      {
        title: 'Clips cortos',
        body: 'La mayoría de segmentos virales duran pocos segundos. Recorta antes de subir.',
      },
      {
        title: 'Vídeo vertical',
        body: 'CoreGenerator exporta MP4 9:16. Filmando en vertical evitas recortes fuertes.',
      },
      {
        title: 'Energía del audio',
        body: 'El boom añade impacto. Si tus clips ya tienen música muy alta, baja el volumen antes de subir.',
      },
      {
        title: 'Nombre claro en la tarjeta',
        body: 'La cortinilla muestra "Tu Nombre CORE". Usa un nombre reconocible.',
      },
      {
        title: 'Caption después de exportar',
        body: 'TikTok, Reels y Shorts necesitan contexto en el texto o en pantalla.',
      },
      {
        title: 'Publica con regularidad',
        body: 'Las plataformas premian la constancia. Prepara varios edits y publícalos en la semana.',
      },
      {
        title: 'Zonas seguras',
        body: 'Deja margen arriba y abajo para la interfaz de la app (usuario, botones, captions).',
      },
    ],
    platformTitle: 'Notas por plataforma',
    platformList: [
      'TikTok – cortes rápidos y sonidos trending en la estrategia del caption.',
      'Instagram Reels – miniaturas y hashtags siguen ayudando al descubrimiento.',
      'YouTube Shorts – título y descripción importan para búsqueda; primer frame claro.',
    ],
    cta: 'Leer la guía paso a paso →',
  },
  examples: {
    metaTitle: 'Ejemplos de vídeos CORE – CoreGenerator',
    metaDescription:
      'Ejemplos y estructuras CORE para deporte, gaming, fitness y lifestyle.',
    title: 'Ejemplos de vídeos CORE',
    lead: 'Todo edit CORE sigue el mismo ritmo: clip → cortinilla negra 2 s con boom → clip. Aquí tienes patrones habituales.',
    structureTitle: 'Estructura estándar',
    structureBlock: `[Clip 1]
   ↓
[Cortinilla 2 s: "Alex CORE" + boom]
   ↓
[Clip 2]
   ↓
[Cortinilla 2 s: "Alex CORE" + boom]
   ↓
[Clip 3]
   …`,
    structureNote:
      'Con 3 clips hay 2 cortinillas. Con 5 clips, 4 transiciones. La duración total = clips + 2 s por cada transición.',
    items: [
      {
        title: 'CORE deportivo',
        desc: '3–6 clips de goles, mates o paradas. Tarjeta: nombre del jugador + CORE.',
        structure: 'Clip → Cortinilla + boom → Clip → Cortinilla + boom → Clip',
      },
      {
        title: 'CORE gym / fitness',
        desc: 'Series cortas, poses o PRs. Mucha energía y nombre en la tarjeta.',
        structure:
          'Calentamiento → Transición → Lift → Transición → Celebración',
      },
      {
        title: 'CORE gaming',
        desc: 'Kills, clutches o fails. Usa tu gamertag en la tarjeta.',
        structure: 'Jugada 1 → Transición → Jugada 2 → Transición → Jugada 3',
      },
      {
        title: 'CORE viajes / lifestyle',
        desc: 'Planos rápidos de sitios, comida, amigos. Cada clip bajo 3 s.',
        structure: 'Escena A → Transición → Escena B → Transición → Escena C',
      },
    ],
    tryTitle: 'Pruébalo tú',
    tryText:
      'Sube tus clips, escribe un nombre y CoreGenerator monta esta estructura automáticamente.',
    cta: 'Generar tu ejemplo →',
  },
  faq: {
    metaTitle: 'FAQ – CoreGenerator',
    metaDescription:
      'Preguntas frecuentes sobre CoreGenerator: límites, formatos, privacidad y generación de vídeos CORE.',
    title: 'Preguntas frecuentes',
    lead: 'Respuestas rápidas. Para privacidad, lee la',
    privacyLink: 'Política de privacidad',
    contactText: '¿Más dudas?',
    contactLink: 'Contáctanos',
    whatIsLink: 'qué es un vídeo CORE',
    items: [
      {
        q: '¿Qué es CoreGenerator?',
        a: 'Herramienta online gratuita que une clips en un edit CORE vertical con tarjetas de título y sonido boom.',
      },
      {
        q: '¿Es gratis?',
        a: 'Sí. Sin registro, sin pago ni suscripción.',
      },
      {
        q: '¿Cuántos clips puedo subir?',
        a: 'Entre 2 y 10 por generación. Máximo 200 MB en total.',
      },
      {
        q: '¿Qué formato tiene el vídeo descargado?',
        a: 'MP4 vertical 1080×1920, 30 fps, H.264 y AAC — compatible con TikTok, Reels y Shorts.',
      },
      {
        q: '¿Qué muestra la tarjeta de título?',
        a: 'Introduces un nombre y aparece como "Nombre CORE" centrado en pantalla durante todo el vídeo.',
      },
      {
        q: '¿Guardáis mis vídeos?',
        a: 'No. Se procesan temporalmente en el servidor y se borran tras la generación. Ver Política de privacidad.',
      },
      {
        q: '¿Necesito instalar algo?',
        a: 'No. Funciona en el navegador. El servidor usa FFmpeg; tú solo necesitas tus archivos de vídeo.',
      },
      {
        q: '¿Puedo usar música con copyright?',
        a: 'Eres responsable del contenido que subes. Asegúrate de tener derechos sobre vídeo y audio.',
      },
      {
        q: '¿Por qué falló la generación?',
        a: 'Causas habituales: formato no válido, pocos clips, tamaño > 200 MB o error del servidor. Prueba MP4 y clips más cortos.',
      },
      {
        q: '¿Habrá anuncios?',
        a: 'Podemos añadir Google AdSense en el futuro. Actualizaremos la política de privacidad antes.',
      },
    ],
  },
  privacy: {
    metaTitle: 'Política de privacidad – CoreGenerator',
    metaDescription:
      'Política de privacidad de CoreGenerator: vídeos subidos, cookies, Google Analytics, AdSense y tus derechos.',
    title: 'Política de privacidad',
    updated: 'Última actualización: 17 de junio de 2026',
    sections: [
      {
        title: '1. Introducción',
        paragraphs: [
          'CoreGenerator ("nosotros", "nuestro" o "el servicio") es una aplicación web gratuita para crear vídeos estilo CORE. Esta política explica qué información recogemos, cómo la usamos y tus derechos.',
          'No exigimos cuentas de usuario ni vendemos datos personales.',
        ],
      },
      {
        title: '2. Responsable',
        paragraphs: [
          'Para consultas de privacidad: hello@coregenerator.app o la página de Contacto.',
        ],
      },
      {
        title: '3. Información que recogemos',
        paragraphs: [
          'Vídeos que subes: se transmiten al servidor solo para procesarlos y generar tu vídeo CORE.',
          'Datos técnicos: páginas visitadas, navegador, dispositivo, ubicación aproximada y eventos de uso mediante Google Analytics 4 cuando esté activo.',
          'Cookies: para funcionalidad básica y analítica. Terceros como Google pueden usar las suyas.',
        ],
        list: [
          'Sin registro obligatorio',
          'Sin datos de pago (servicio gratuito)',
          'Sin almacenamiento permanente de tus vídeos',
        ],
      },
      {
        title: '4. Uso de la información',
        paragraphs: [],
        list: [
          'Procesar y generar tu vídeo CORE',
          'Proteger el servicio (límites, rate limit)',
          'Mejorar el sitio con analítica agregada',
          'Mostrar publicidad si activamos AdSense',
          'Responder solicitudes de soporte o legales',
        ],
      },
      {
        title: '5. Retención de vídeos',
        paragraphs: [
          'Los clips se guardan temporalmente durante el procesamiento. Se eliminan automáticamente tras enviar el resultado, normalmente en minutos.',
          'No creamos una biblioteca de vídeos de usuarios ni reutilizamos tus subidas.',
        ],
      },
      {
        title: '6. Servicios de terceros',
        paragraphs: [
          'Google Analytics 4: mide tráfico y uso. Consulta la política de privacidad de Google.',
          'Google AdSense (futuro): puede usar cookies para anuncios. Actualizaremos esta política y mostraremos consentimiento si es legalmente necesario.',
          'Hosting: proveedores pueden procesar logs técnicos (IP, metadatos de petición) por seguridad.',
        ],
      },
      {
        title: '7. Tus derechos',
        paragraphs: [
          'Según tu país puedes acceder, rectificar, suprimir u oponerte al tratamiento. Escríbenos a hello@coregenerator.app.',
          'Residentes en el EEE/Reino Unido pueden reclamar ante su autoridad de protección de datos.',
        ],
      },
      {
        title: '8. Menores',
        paragraphs: [
          'El servicio no está dirigido a menores de 13 años. Si crees que un menor nos ha enviado datos, contáctanos para eliminarlos.',
        ],
      },
      {
        title: '9. Seguridad',
        paragraphs: [
          'Usamos HTTPS, límites de subida, rate limiting y limpieza de temporales. Ningún sistema es 100 % seguro.',
        ],
      },
      {
        title: '10. Cambios',
        paragraphs: [
          'Podemos actualizar esta política. La fecha arriba indicará la última revisión.',
        ],
      },
    ],
  },
  terms: {
    metaTitle: 'Términos de uso – CoreGenerator',
    metaDescription: 'Términos de uso de CoreGenerator.',
    title: 'Términos de uso',
    updated: 'Última actualización: 17 de junio de 2026',
    sections: [
      {
        title: 'Aceptación',
        paragraphs: [
          'Al usar CoreGenerator aceptas estos términos. Si no estás de acuerdo, no uses el servicio.',
        ],
      },
      {
        title: 'Descripción del servicio',
        paragraphs: [
          'CoreGenerator ofrece una herramienta gratuita para unir clips en un vídeo CORE vertical. El servicio se proporciona "tal cual", sin garantías.',
        ],
      },
      {
        title: 'Tu contenido',
        paragraphs: [
          'Eres responsable de los vídeos que subes. Debes tener derechos o permiso para usarlos y editarlos. No subas contenido ilegal o que infrinja derechos de terceros.',
        ],
      },
      {
        title: 'Uso aceptable',
        paragraphs: [],
        list: [
          'No subir contenido sin derechos',
          'No sobrecargar ni abusar del servicio',
          'No usar bots para abusar de la API',
        ],
      },
      {
        title: 'Limitación de responsabilidad',
        paragraphs: [
          'CoreGenerator es un servicio gratuito. No somos responsables de pérdidas por fallos de generación o archivos perdidos.',
        ],
      },
      {
        title: 'Cambios',
        paragraphs: [
          'Podemos modificar estos términos. El uso continuado implica aceptación.',
        ],
      },
      {
        title: 'Contacto',
        paragraphs: [
          'Consultas: página de Contacto o hello@coregenerator.app.',
        ],
      },
    ],
  },
  contact: {
    metaTitle: 'Contacto – CoreGenerator',
    metaDescription: 'Contacta con CoreGenerator.',
    title: 'Contacto',
    intro: '¿Preguntas, feedback o problemas con CoreGenerator? Escríbenos.',
    emailLabel: 'Email:',
    note: 'Respondemos en un plazo de 2 a 5 días laborables.',
    topicsTitle: 'Temas habituales',
    topics: [
      'Errores o generaciones fallidas',
      'Privacidad y tratamiento de datos',
      'Sugerencias de funciones',
      'Publicidad o colaboraciones',
    ],
  },
};

export default es;
