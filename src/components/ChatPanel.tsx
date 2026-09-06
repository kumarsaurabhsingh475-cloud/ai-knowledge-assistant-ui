import { useRef, useState } from 'react';
import { streamChat } from '../api/client';
import { CHAT_EMPTY, CHAT_LOADING, CHAT_PLACEHOLDER } from '../config/branding';
import { useStreamingText } from '../hooks/useStreamingText';
import { LoadingDots } from './LoadingDots';
import { MarkdownStream } from './MarkdownStream';

export function ChatPanel() {
  const [message, setMessage] = useState('');
  const [activeMessage, setActiveMessage] = useState('');
  const closeRef = useRef<(() => void) | null>(null);
  const stream = useStreamingText();

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || stream.isTyping) return;

    setActiveMessage(trimmed);
    setMessage('');
    stream.reset();
    stream.startReceiving();

    closeRef.current = streamChat(
      trimmed,
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

  const waitingForFirstToken = stream.isReceiving && !stream.displayed;
  const showResponse = !waitingForFirstToken;

  return (
    <div className="panel">
      <div className="field">
        <textarea
          id="chat-message"
          placeholder={CHAT_PLACEHOLDER}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
          }}
        />
      </div>

      <div className="actions">
        <button className="btn-primary" disabled={!message.trim() || stream.isTyping} onClick={handleSend}>
          {stream.isTyping && <span className="spinner" />}
          {stream.isTyping ? 'Writing...' : 'Send'}
        </button>
        {stream.isTyping && (
          <button className="btn-secondary" type="button" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>

      {activeMessage && <p className="submitted-prompt">{activeMessage}</p>}

      {waitingForFirstToken && <LoadingDots label={CHAT_LOADING} />}

      {showResponse && (!activeMessage || stream.displayed || stream.isTyping) && (
        <MarkdownStream
          content={stream.displayed}
          streaming={stream.isTyping}
          placeholder={activeMessage ? undefined : CHAT_EMPTY}
        />
      )}
    </div>
  );
}
