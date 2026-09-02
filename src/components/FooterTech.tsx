import { FOOTER_LINE, TECH_STACK } from '../config/social';

export function FooterTech() {
  return (
    <div className="footer-tech" tabIndex={0}>
      <p className="footer-tech-line">
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
