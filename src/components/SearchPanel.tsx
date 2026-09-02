import { useState } from 'react';
import { searchDocuments } from '../api/client';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ content: string; metadata: Record<string, unknown> }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setError('');
    try {
      const res = await searchDocuments(query.trim());
      setResults(res.data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Search Documents</h2>
      <p className="hint">Find relevant chunks from ingested PDFs using vector similarity.</p>

      <div className="field">
        <label htmlFor="search-query">Search query</label>
        <input
          id="search-query"
          type="text"
          placeholder="Spring Boot configuration"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className="actions">
        <button className="btn-primary" disabled={!query.trim() || loading} onClick={handleSearch}>
          {loading && <span className="spinner" />}
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="result-box">
        {results.length === 0 ? (
          <span className="empty">{loading ? 'Searching…' : 'Results will appear here.'}</span>
        ) : (
          results.map((r, i) => (
            <div key={i} className="search-result">
              <div className="score">Result {i + 1}</div>
              <div>{r.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
