import { useRef, useState } from 'react';
import { streamAsk } from '../api/client';
import { useStreamingText } from '../hooks/useStreamingText';
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

  return (
    <div className="panel">
      <h2>Ask a Question</h2>
      <p className="hint">Get answers grounded in your uploaded documents (RAG). Responses stream in Markdown.</p>

      <div className="field">
        <label htmlFor="question">Your question</label>
        <textarea
          id="question"
          placeholder="What is the main topic of the document?"
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
          {stream.isTyping ? 'Generating…' : 'Ask'}
        </button>
        {stream.isTyping && (
          <button className="btn-secondary" type="button" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}

      <MarkdownStream
        content={stream.displayed}
        streaming={stream.isTyping}
        placeholder={
          stream.isReceiving && !stream.displayed
            ? 'Searching documents and generating answer…'
            : 'Answer will appear here.'
        }
      />
    </div>
  );
}
