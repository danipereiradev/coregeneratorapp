# CoreGenerator

Herramienta gratuita para generar vídeos estilo **CORE** (vertical, transiciones con boom y tarjetas de título) para TikTok, Reels y Shorts.

Idiomas: **español (por defecto)** e **inglés** (selector en la cabecera).

---

## Requisitos

| Componente | Versión |
|---|---|
| Node.js | 18+ (recomendado 20+) |
| FFmpeg | En PATH del servidor backend |
| npm | 9+ |

### Instalar FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install -y ffmpeg

# Verificar
ffmpeg -version
ffprobe -version
```

---

## Desarrollo local

Necesitas **dos terminales**:

```bash
# Terminal 1 – Backend
cd backend
npm install
cp .env.example .env
npm run dev
# → http://localhost:4000

# Terminal 2 – Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173
```

En desarrollo el frontend usa **proxy de Vite** (`/api` → `localhost:4000`). No hace falta poner `VITE_API_URL` en `.env` local.

### Assets obligatorios (backend)

Coloca estos archivos en `backend/assets/`:

| Archivo | Descripción |
|---|---|
| `boom.mp3` | Sonido boom en cada transición |
| `transition.mp4` | Cortinilla negra 2 s (1080×1920, 30 fps) |
| `skull.png` | Emoji 💀 en la tarjeta de título |

Si faltan, la app sigue funcionando con fallbacks (sin boom o cortinilla generada).

---

## Variables de entorno

### Frontend (`frontend/.env`)

| Variable | Desarrollo | Producción |
|---|---|---|
| `VITE_API_URL` | Vacío (usa proxy) | `https://api.tudominio.com` |

### Backend (`backend/.env`)

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del API (ej. `4000`) |
| `FRONTEND_URL` | URL del frontend para CORS (ej. `https://tudominio.com`) |
| `MAX_UPLOAD_MB` | Límite total de subida (default `200`) |

---

## Deploy en producción (checklist 100%)

### 1. Dominio y DNS

- [ ] Dominio principal, ej. `tudominio.com` → frontend
- [ ] Subdominio API, ej. `api.tudominio.com` → backend
- [ ] HTTPS en ambos (Let's Encrypt / Cloudflare)

### 2. Servidor backend (VPS recomendado: Railway, Render, Fly.io, Hetzner, DigitalOcean)

El backend **necesita FFmpeg** y espacio en disco para temporales.

```bash
cd backend
npm install
npm run build
cp .env.example .env
# Editar .env:
#   PORT=4000
#   FRONTEND_URL=https://tudominio.com
#   MAX_UPLOAD_MB=200

# Asegurar assets
ls assets/boom.mp3 assets/transition.mp4 assets/skull.png

# Arrancar
npm start
# o con PM2:
# pm2 start dist/server.js --name coregenerator-api
```

**Importante:**
- `cwd` del proceso debe ser la carpeta `backend/` (para encontrar `assets/` y `temp/`)
- FFmpeg instalado en el sistema
- Carpeta `temp/` con permisos de escritura

### 3. Frontend (Vercel, Netlify, Cloudflare Pages)

```bash
cd frontend
npm install
npm run build
# Salida en frontend/dist/
```

Variables en el panel del hosting:

```
VITE_API_URL=https://api.tudominio.com
```

Configurar **SPA fallback**: todas las rutas (`/faq`, `/privacy`, etc.) deben servir `index.html`.

**Netlify** – crear `frontend/public/_redirects`:
```
/*    /index.html   200
```

**Vercel** – `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### 4. CORS

En el backend, `FRONTEND_URL` debe coincidir **exactamente** con la URL del frontend (con `https://`, sin barra final).

### 5. Google Analytics 4

En `frontend/index.html`, descomenta el bloque GA4 y sustituye `G-XXXXXXXXXX` por tu ID de medición.

### 6. Google AdSense (futuro)

- Tener páginas legales publicadas (`/privacy`, `/terms`, `/contact`) ✅
- Añadir banner de cookies antes de activar ads en la UE
- Insertar placeholders (`AdPlaceholder`) por divs de AdSense cuando aprueben el sitio

### 7. Email de contacto

Sustituye `hello@coregenerator.app` en las páginas de Contact y Privacy por tu email real.

### 8. Prueba post-deploy

```bash
# Health
curl https://api.tudominio.com/api/health

# Generación (con 2 vídeos de prueba)
curl -X POST https://api.tudominio.com/api/generate \
  -F "personName=Test" \
  -F "videos=@clip1.mp4" \
  -F "videos=@clip2.mp4" \
  -o test-output.mp4
```

En el navegador: subir 2 clips → nombre → Generar → Descargar MP4 vertical.

---

## Estructura del proyecto

```
generador-core/
├── frontend/          React + Vite + TypeScript + i18n (es/en)
│   └── src/i18n/      Traducciones
├── backend/           Express + FFmpeg
│   ├── assets/        boom.mp3, transition.mp4, skull.png
│   ├── temp/          Archivos temporales (auto-limpieza)
│   └── src/
│       ├── routes/    POST /api/generate
│       └── services/  Pipeline de vídeo
└── README.md
```

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/generate` | Subir clips + `personName`, devuelve MP4 |

**Límites:** 2–10 vídeos, 200 MB total, rate limit 20 req / 15 min por IP.

---

## Limitaciones conocidas

- Sin cuentas de usuario ni historial
- Vídeos procesados temporalmente, no guardados
- El emoji 💀 en la tarjeta puede no renderizarse en todas las fuentes
- Requiere FFmpeg en el servidor; sin él la generación falla
- Un solo estilo de edit CORE (sin plantillas múltiples)

---

## Scripts

```bash
# Backend
cd backend && npm run dev    # desarrollo
cd backend && npm run build && npm start  # producción

# Frontend
cd frontend && npm run dev   # desarrollo
cd frontend && npm run build  # build estático
```

---

## Licencia

Uso libre. Ajusta términos legales si escalas tráfico o monetizas.
