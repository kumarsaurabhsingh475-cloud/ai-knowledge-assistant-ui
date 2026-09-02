import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownStreamProps {
  content: string;
  streaming?: boolean;
  placeholder?: string;
}

/**
 * Renders streaming markdown with a typewriter cursor while generating.
 */
export function MarkdownStream({ content, streaming = false, placeholder }: MarkdownStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content || !streaming) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [content, streaming]);

  if (!content) {
    return (
      <div className="result-box empty markdown-body">
        {placeholder ?? 'Response will appear here.'}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="result-box markdown-body streaming">
      <ReactMarkdown>{content}</ReactMarkdown>
      {streaming && <span className="typing-cursor" aria-hidden="true" />}
    </div>
  );
}
