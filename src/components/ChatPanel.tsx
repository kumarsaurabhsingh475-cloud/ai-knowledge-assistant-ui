import { useRef, useState } from 'react';
import { streamChat } from '../api/client';
import { useStreamingText } from '../hooks/useStreamingText';
import { MarkdownStream } from './MarkdownStream';

export function ChatPanel() {
  const [message, setMessage] = useState('');
  const closeRef = useRef<(() => void) | null>(null);
  const stream = useStreamingText();

  const handleSend = () => {
    if (!message.trim() || stream.isTyping) return;
    stream.reset();
    stream.startReceiving();

    closeRef.current = streamChat(
      message.trim(),
      stream.appendChunk,
      () => stream.finishReceiving(),
      () => stream.finishReceiving(),
    );
  };

  const handleStop = () => {
    closeRef.current?.();
    stream.finishReceiving();
    stream.flush();
  };

  return (
    <div className="panel">
      <h2>Chat</h2>
      <p className="hint">Direct conversation with Gemini. Responses stream in Markdown.</p>

      <div className="field">
        <label htmlFor="chat-message">Message</label>
        <textarea
          id="chat-message"
          placeholder="Say hello to Gemini…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
          }}
        />
      </div>

      <div className="actions">
        <button className="btn-primary" disabled={!message.trim() || stream.isTyping} onClick={handleSend}>
          {stream.isTyping ? 'Streaming…' : 'Send'}
        </button>
        {stream.isTyping && (
          <button className="btn-secondary" type="button" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>

      <MarkdownStream
        content={stream.displayed}
        streaming={stream.isTyping}
        placeholder={
          stream.isReceiving && !stream.displayed ? 'Waiting for response…' : 'Response will stream here.'
        }
      />
    </div>
  );
}
