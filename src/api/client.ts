import { BACKEND_URL } from '../config/backend';

/** Dev uses Vite proxy unless VITE_API_URL is set. Production requires VITE_API_URL. */
const BASE = import.meta.env.DEV && !import.meta.env.VITE_API_URL ? '/api' : BACKEND_URL;

/** SSE streams go directly to the backend to avoid proxy buffering. */
const STREAM_BASE = BACKEND_URL;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AskData {
  answer: string;
}

export interface SearchResult {
  content: string;
  metadata: Record<string, unknown>;
}

export interface SearchData {
  totalResults: number;
  results: SearchResult[];
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || body.error || 'Request failed');
  }
  return body as T;
}

export async function ingestPdf(file: File): Promise<ApiResponse<null>> {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${BASE}/ingest`, { method: 'POST', body: form });
  return handleResponse(response);
}

export async function searchDocuments(query: string): Promise<ApiResponse<SearchData>> {
  const response = await fetch(`${BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return handleResponse(response);
}

function parseSseEvents(raw: string, onChunk: (chunk: string) => void): string {
  const events = raw.split('\n\n');
  const remainder = events.pop() ?? '';

  for (const event of events) {
    const dataLines = event
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).replace(/^\s/, ''));

    if (dataLines.length === 0) continue;

    const data = dataLines.join('\n');
    if (data === '[DONE]') continue;
    onChunk(data);
  }

  return remainder;
}

function streamSse(
  url: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'text/event-stream' },
      });

      if (!response.ok) {
        onError(`Request failed (${response.status})`);
        onDone();
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError('No response body');
        onDone();
        return;
      }

      const decoder = new TextDecoder();
      let sseBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        sseBuffer = parseSseEvents(sseBuffer, onChunk);
      }

      sseBuffer += decoder.decode();
      if (sseBuffer.trim()) {
        parseSseEvents(`${sseBuffer}\n\n`, onChunk);
      }

      onDone();
    } catch (err) {
      if (controller.signal.aborted) {
        onDone();
        return;
      }
      onError(err instanceof Error ? err.message : 'Stream failed');
      onDone();
    }
  })();

  return () => controller.abort();
}

/** Streams RAG answer chunks via SSE. */
export function streamAsk(
  question: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): () => void {
  const url = `${STREAM_BASE}/ask/stream?question=${encodeURIComponent(question)}`;
  return streamSse(url, onChunk, onDone, onError);
}

/** Streams chat response chunks via SSE. */
export function streamChat(
  message: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): () => void {
  const url = `${STREAM_BASE}/chat/stream?message=${encodeURIComponent(message)}`;
  return streamSse(url, onChunk, onDone, onError);
}
