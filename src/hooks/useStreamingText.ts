import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_CHARS_PER_SEC = 35;
const MAX_CHARS_PER_SEC = 280;
const CATCHUP_THRESHOLD = 60;

/**
 * Buffers network chunks and reveals text gradually for a ChatGPT-like typewriter effect.
 */
export function useStreamingText() {
  const bufferRef = useRef('');
  const displayedLenRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [displayed, setDisplayed] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (time: number) => {
      const buffer = bufferRef.current;
      const currentLen = displayedLenRef.current;

      if (currentLen >= buffer.length) {
        setIsAnimating(false);
        rafRef.current = null;
        lastTimeRef.current = 0;
        return;
      }

      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const backlog = buffer.length - currentLen;
      const speed =
        backlog > CATCHUP_THRESHOLD
          ? Math.min(MAX_CHARS_PER_SEC, MIN_CHARS_PER_SEC + backlog * 1.5)
          : MIN_CHARS_PER_SEC;

      const charsToAdd = Math.max(1, Math.floor((delta / 1000) * speed));
      const nextLen = Math.min(currentLen + charsToAdd, buffer.length);

      displayedLenRef.current = nextLen;
      setDisplayed(buffer.slice(0, nextLen));
      setIsAnimating(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  const startAnimation = useCallback(() => {
    if (rafRef.current === null) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const reset = useCallback(() => {
    stopAnimation();
    bufferRef.current = '';
    displayedLenRef.current = 0;
    lastTimeRef.current = 0;
    setDisplayed('');
    setIsReceiving(false);
    setIsAnimating(false);
  }, [stopAnimation]);

  const appendChunk = useCallback(
    (chunk: string) => {
      if (!chunk) return;
      bufferRef.current += chunk;
      startAnimation();
    },
    [startAnimation],
  );

  const startReceiving = useCallback(() => {
    setIsReceiving(true);
  }, []);

  const finishReceiving = useCallback(() => {
    setIsReceiving(false);
    startAnimation();
  }, [startAnimation]);

  const flush = useCallback(() => {
    stopAnimation();
    const full = bufferRef.current;
    displayedLenRef.current = full.length;
    setDisplayed(full);
    setIsAnimating(false);
  }, [stopAnimation]);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  return {
    displayed,
    isReceiving,
    isAnimating,
    isTyping: isReceiving || isAnimating,
    reset,
    appendChunk,
    startReceiving,
    finishReceiving,
    flush,
  };
}
