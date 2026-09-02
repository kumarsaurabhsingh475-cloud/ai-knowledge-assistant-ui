import { useEffect, useState } from 'react';
import { IngestPanel } from './components/IngestPanel';
import { AskPanel } from './components/AskPanel';
import { ChatPanel } from './components/ChatPanel';
import { SearchPanel } from './components/SearchPanel';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

type Tab = 'ingest' | 'ask' | 'chat' | 'search';
type Theme = 'light' | 'dark';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ingest', label: 'Upload' },
  { id: 'ask', label: 'Ask' },
  { id: 'chat', label: 'Chat' },
  { id: 'search', label: 'Search' },
];

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('ingest');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AI Knowledge Assistant</h1>
        <p>Upload PDFs, ask questions, and search your knowledge base</p>
      </header>

      <div className="tabs-row">
        <nav className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {activeTab === 'ingest' && <IngestPanel />}
      {activeTab === 'ask' && <AskPanel />}
      {activeTab === 'chat' && <ChatPanel />}
      {activeTab === 'search' && <SearchPanel />}

      <footer className="footer">
        <p className="footer-line">Backend: localhost:8080 · Spring Boot + Spring AI + Gemini</p>
        <p className="footer-credit">Developed by Saurabh Kumar</p>
      </footer>
    </div>
  );
}
