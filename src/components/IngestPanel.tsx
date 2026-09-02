import { useRef, useState } from 'react';
import { ingestPdf } from '../api/client';
import { UPLOAD_BUTTON, UPLOAD_LOADING, UPLOAD_SUCCESS } from '../config/branding';
import { LoadingDots } from './LoadingDots';

export function IngestPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (selected: File | null) => {
    if (selected && selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await ingestPdf(file);
      setMessage(UPLOAD_SUCCESS);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel panel--ingest">
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => !loading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileChange(e.dataTransfer.files?.[0] ?? null);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="upload-input"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <div className="upload-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1" strokeLinecap="round" />
          </svg>
        </div>
        <p className="upload-title">{file ? 'Change file' : 'Drop your PDF here'}</p>
        <p className="upload-subtitle">PDF only, max 10 MB</p>
        {file && <p className="upload-filename">{file.name}</p>}
      </div>

      {loading && <LoadingDots label={UPLOAD_LOADING} />}

      <div className="actions">
        <button className="btn-primary" disabled={!file || loading} onClick={handleSubmit}>
          {loading && <span className="spinner" />}
          {loading ? 'Uploading...' : UPLOAD_BUTTON}
        </button>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
    </div>
  );
}
