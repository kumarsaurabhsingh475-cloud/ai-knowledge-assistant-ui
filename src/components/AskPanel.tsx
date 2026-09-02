import { useRef, useState } from 'react';
import { streamAsk } from '../api/client';
import { ASK_LOADING, ASK_PLACEHOLDER } from '../config/branding';
import { useStreamingText } from '../hooks/useStreamingText';
import { LoadingDots } from './LoadingDots';
import { MarkdownStream } from './MarkdownStream';

export function AskPanel() {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const closeRef = useRef<(() => void) | null>(null);
  const stream = useStreamingText();

  const handleSubmit = () => {
    if (!question.trim() || stream.isTyping) return;
    setError('');
    stream.reset();
    stream.startReceiving();

    closeRef.current = streamAsk(
      question.trim(),
      stream.appendChunk,
      () => stream.finishReceiving(),
      (msg) => {
        setError(msg);
        stream.finishReceiving();
      },
    );
  };

  const handleStop = () => {
    closeRef.current?.();
    stream.finishReceiving();
    stream.flush();
  };

  const waitingForFirstToken = stream.isReceiving && !stream.displayed;

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

      {error && <div className="alert error">{error}</div>}

      {waitingForFirstToken && (
        <>
          <LoadingDots label={ASK_LOADING} />
          <div className="skeleton-shimmer" aria-hidden="true" />
        </>
      )}

      {!waitingForFirstToken && (
        <MarkdownStream
          content={stream.displayed}
          streaming={stream.isTyping}
          placeholder={ASK_PLACEHOLDER}
        />
      )}
    </div>
  );
}
