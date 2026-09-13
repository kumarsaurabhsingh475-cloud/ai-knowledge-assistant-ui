import { useCallback, useEffect, useRef, useState } from 'react';
import { streamAsk } from '../api/client';
import { ASK_LOADING, ASK_PLACEHOLDER } from '../config/branding';
import { usePendingRequest } from '../context/PendingRequestContext';
import { useStreamingText } from '../hooks/useStreamingText';
import { LoadingDots } from './LoadingDots';
import { MarkdownStream } from './MarkdownStream';

export function AskPanel() {
  const [question, setQuestion] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');
  const [error, setError] = useState('');
  const closeRef = useRef<(() => void) | null>(null);
  const stream = useStreamingText();
  const { registerPending, clearPending } = usePendingRequest();

  const abortRequest = useCallback(() => {
    closeRef.current?.();
    closeRef.current = null;
    stream.finishReceiving();
    stream.flush();
    clearPending('ask');
  }, [stream, clearPending]);

  useEffect(() => () => clearPending('ask'), [clearPending]);

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed || stream.isTyping) return;

    setActiveQuestion(trimmed);
    setQuestion('');
    setError('');
    stream.reset();
    stream.startReceiving();

    closeRef.current = streamAsk(
      trimmed,
      stream.appendChunk,
      () => {
        clearPending('ask');
        stream.finishReceiving();
      },
      (msg) => {
        setError(msg);
        clearPending('ask');
        stream.finishReceiving();
      },
    );
    registerPending('ask', abortRequest);
  };

  const handleStop = () => {
    abortRequest();
  };

  const waitingForFirstToken = stream.isReceiving && !stream.displayed;
  const showResponse = !waitingForFirstToken;

  return (
    <div className="panel">
      <div className="field">
        <textarea
          id="question"
          placeholder="What are the key points in my document?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
          }}
        />
      </div>

      <div className="actions">
        <button className="btn-primary" disabled={!question.trim() || stream.isTyping} onClick={handleSubmit}>
          {stream.isTyping && <span className="spinner" />}
          {stream.isTyping ? 'Finding RAG answer...' : 'Get RAG answer'}
        </button>
        {stream.isTyping && (
          <button className="btn-secondary" type="button" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>

      {activeQuestion && <p className="submitted-prompt">{activeQuestion}</p>}

      {error && <div className="alert error">{error}</div>}

      {waitingForFirstToken && (
        <>
          <LoadingDots label={ASK_LOADING} />
          <div className="skeleton-shimmer" aria-hidden="true" />
        </>
      )}

      {showResponse && (!activeQuestion || stream.displayed || stream.isTyping) && (
        <MarkdownStream
          content={stream.displayed}
          streaming={stream.isTyping}
          placeholder={activeQuestion ? undefined : ASK_PLACEHOLDER}
        />
      )}
    </div>
  );
}
