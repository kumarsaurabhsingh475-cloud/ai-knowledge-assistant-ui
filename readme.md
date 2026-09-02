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
- Backend running at `http://localhost:8080`

## Run (dev)

Terminal 1 — Backend (`../ai-knowledge-assistant`):

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

## Production build

Set the backend URL before building:

```bash
cp .env.example .env
# edit VITE_API_URL=https://your-backend.onrender.com
npm run build
```

Deploy the `dist/` folder to Render Static Site, Vercel, or Netlify.

## Build

```bash
npm run build
```

Output: `dist/`

## Deploy into backend (single server on :8080)

```bash
npm run deploy:backend
```

Then run the backend and open **http://localhost:8080**

## Tech

- React 19 + TypeScript + Vite
- react-markdown + ChatGPT-style streaming typewriter
- Light/dark theme

## Author

**Saurabh Kumar**
