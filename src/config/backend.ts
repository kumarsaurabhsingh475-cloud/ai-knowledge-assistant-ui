export const BACKEND_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8080' : '');

export const BACKEND_LABEL = BACKEND_URL
  ? BACKEND_URL.replace(/^https?:\/\//, '')
  : 'VITE_API_URL not set';
