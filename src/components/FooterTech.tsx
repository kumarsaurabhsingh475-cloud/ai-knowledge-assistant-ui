import { useState } from 'react';
import { FOOTER_LINE, TECH_STACK } from '../config/social';

export function FooterTech() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((value) => !value);

  return (
    <div className="footer-tech">
      <p
        className={`footer-tech-line ${open ? 'is-open' : ''}`}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label="Show tech stack"
        onClick={() => {
          if (window.matchMedia('(hover: none)').matches) toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {FOOTER_LINE.lead}{' '}
        <span className="footer-tech-keyword">{FOOTER_LINE.rag}</span>
        {FOOTER_LINE.middle}{' '}
        <span className="footer-tech-keyword">{FOOTER_LINE.gemini}</span>
      </p>

      <p className="footer-tech-stack" role="tooltip" aria-label="Tech stack">
        {TECH_STACK.join(' · ')}
      </p>
    </div>
  );
}
