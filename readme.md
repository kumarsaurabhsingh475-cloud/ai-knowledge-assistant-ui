# AI Knowledge Assistant - UI

React + Vite frontend for the [AI Knowledge Assistant](https://github.com/kumarsaurabhsingh475-cloud/ai-knowledge-assistant) backend.

## Features

| Tab | API | Description |
|-----|-----|-------------|
| Upload | `POST /ingest` | Ingest a PDF into the vector store |
| Ask | `GET /ask/stream` | RAG question answering (SSE) |
| Chat | `GET /chat/stream` | Streaming Gemini chat (SSE) |
| Search | `POST /search` | Vector similarity search |

## Prerequisites

- Node.js 18+
- Backend running locally or on Render

## Run (dev)

Terminal 1 — Backend:

```bash
export GEMINI_API_KEY=your-key
./mvnw spring-boot:run
```

Terminal 2 — UI:

```bash
npm install
npm run dev
```

Or on Windows: double-click `start-ui.cmd`

Open **http://127.0.0.1:5173**

## Deploy to Vercel

### 1. Push this repo to GitHub

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `ai-knowledge-assistant-ui` repo
3. Framework Preset: **Vite** (auto-detected)
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 3. Environment Variable (required)

Add in Vercel → **Settings → Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ai-knowledge-assistant-jgwm.onrender.com` |

Apply to **Production**, **Preview**, and **Development**.

### 4. Update backend CORS on Render

Add your Vercel URL to Render env `CORS_ALLOWED_ORIGINS`:

```
http://localhost:5173,http://127.0.0.1:5173,https://your-project.vercel.app
```

Replace `your-project.vercel.app` with the URL Vercel gives you after deploy.

### 5. Deploy

Click **Deploy**. Your UI will be live at `https://your-project.vercel.app`

> **Note:** Render free tier cold start — first API call may take 30–50 seconds.

## Local production build test

```bash
cp .env.example .env
npm run build
npm run preview
```

## Deploy into backend static folder (optional)

```bash
npm run deploy:backend
```

Then run the backend on port 8080 — UI and API on same server.

## Tech

- React 19 + TypeScript + Vite
- react-markdown + ChatGPT-style streaming typewriter
- Light/dark theme

## Author

**Saurabh Kumar**
