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

### 2. Backend en Railway (recomendado)

1. En [Railway](https://railway.app), crea un servicio desde el repo y configura **Root Directory: `backend`**
2. Variables de entorno:

| Variable | Valor |
|---|---|
| `FRONTEND_URL` | URL del frontend (ej. `https://tu-app.vercel.app`) |
| `MAX_UPLOAD_MB` | `100`–`200` según plan (opcional) |

`PORT` lo asigna Railway automáticamente.

3. El deploy usa `nixpacks.toml` (instala FFmpeg) y `railway.toml` (build, health check en `/api/health`)
4. Copia la URL pública del servicio (ej. `https://xxx.up.railway.app`) y configúrala en el frontend como `VITE_API_URL`

**Verificación post-deploy:**

```bash
curl https://tu-api.up.railway.app/api/health
# {"status":"ok","service":"coregenerator-backend","ffmpeg":true}
```

### 2b. Backend en VPS (Hetzner, DigitalOcean, etc.)

```bash
cd backend
npm install
npm run build
cp .env.example .env
# Editar FRONTEND_URL y MAX_UPLOAD_MB

npm start
```

Requisitos: FFmpeg en el sistema, `cwd` en `backend/`, carpeta `temp/` con permisos de escritura.

### 3. Frontend en Vercel

1. En Vercel, **Root Directory: `frontend`**
2. Variable de entorno obligatoria (Settings → Environment Variables):

```
VITE_API_URL=https://tu-servicio.up.railway.app
```

Sin barra final. **Redeploy** tras guardarla (Vite la embebe en el build).

3. El frontend llama al backend de Railway directamente. No uses proxy en Vercel: los vídeos pueden pesar hasta 200 MB y superan el límite de las funciones serverless.

**Netlify / Cloudflare Pages** – misma variable `VITE_API_URL` y SPA fallback.

**Netlify** – `frontend/public/_redirects`:
```
/*    /index.html   200
```

### 4. CORS

En Railway, `FRONTEND_URL` debe ser la URL exacta del frontend:

```
FRONTEND_URL=https://coregeneratorapp.vercel.app
```

Varios orígenes separados por coma si hace falta (preview + producción).

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
