import { useEffect, useRef } from 'react';
import {
  NAV_GUARD_BODY,
  NAV_GUARD_LEAVE,
  NAV_GUARD_STAY,
  NAV_GUARD_TITLE,
} from '../config/branding';

interface NavigationGuardModalProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function NavigationGuardModal({ open, onStay, onLeave }: NavigationGuardModalProps) {
  const stayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    stayRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onStay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onStay]);

  if (!open) return null;

  return (
    <div className="nav-guard-backdrop" role="presentation" onClick={onStay}>
      <div
        className="nav-guard-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="nav-guard-title"
        aria-describedby="nav-guard-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="nav-guard-title" className="nav-guard-title">
          {NAV_GUARD_TITLE}
        </h2>
        <p id="nav-guard-desc" className="nav-guard-body">
          {NAV_GUARD_BODY}
        </p>
        <div className="nav-guard-actions">
          <button ref={stayRef} type="button" className="btn-primary" onClick={onStay}>
            {NAV_GUARD_STAY}
          </button>
          <button type="button" className="btn-secondary" onClick={onLeave}>
            {NAV_GUARD_LEAVE}
          </button>
        </div>
      </div>
    </div>
  );
}
