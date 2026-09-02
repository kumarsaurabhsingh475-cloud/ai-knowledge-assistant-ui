interface LoadingDotsProps {
  label?: string;
}

/** Human-feel pulse loader with label. */
export function LoadingDots({ label = 'Working on it' }: LoadingDotsProps) {
  return (
    <div className="loading-dots" role="status" aria-live="polite">
      <span className="loading-dots-track" aria-hidden="true">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </span>
      <span className="loading-dots-label">{label}</span>
    </div>
  );
}
