import { useEffect, useState } from 'react';
import { IngestPanel } from './components/IngestPanel';
import { AskPanel } from './components/AskPanel';
import { ChatPanel } from './components/ChatPanel';
import { NavigationGuardModal } from './components/NavigationGuardModal';
import { PanelShell } from './components/PanelShell';
import { FooterTech } from './components/FooterTech';
import { SocialLinks } from './components/SocialLinks';
import { ThemeToggle } from './components/ThemeToggle';
import {
  APP_NAME,
  APP_TAGLINE,
  ASK_DESC,
  CHAT_DESC,
  NAV_CHAT,
  NAV_RAG,
  UPLOAD_DESC,
} from './config/branding';
import { usePendingRequest } from './context/PendingRequestContext';
import './App.css';

type DocsTab = 'ingest' | 'ask';
type Mode = 'docs' | 'chat';
type Tab = DocsTab | 'chat';

const DOCS_TABS: { id: DocsTab; label: string }[] = [
  { id: 'ingest', label: 'Upload' },
  { id: 'ask', label: 'Ask' },
];

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [mode, setMode] = useState<Mode>('docs');
  const [docsTab, setDocsTab] = useState<DocsTab>('ingest');
  const [theme, setTheme] = useState(getInitialTheme);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const { isPending, cancelPending } = usePendingRequest();

  const activeTab: Tab = mode === 'chat' ? 'chat' : docsTab;

  const sectionDesc =
    mode === 'chat' ? CHAT_DESC : docsTab === 'ingest' ? UPLOAD_DESC : ASK_DESC;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = mode === 'chat' ? `${APP_NAME} - Chat` : APP_NAME;
  }, [mode]);

  const requestModeChange = (next: Mode) => {
    if (next === mode) return;
    if (isPending) {
      setPendingMode(next);
      return;
    }
    setMode(next);
  };

  const handleStay = () => {
    setPendingMode(null);
  };

  const handleLeave = () => {
    cancelPending();
    if (pendingMode) {
      setMode(pendingMode);
    }
    setPendingMode(null);
  };

  return (
    <div className="page-shell">
      <div className="app">
        <header className="header">
          <div className="header-copy">
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
          </div>
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
        </header>

        <nav className="segment-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`segment-btn ${mode === 'docs' ? 'active' : ''}`}
            onClick={() => requestModeChange('docs')}
          >
            {NAV_RAG}
          </button>
          <button
            type="button"
            className={`segment-btn ${mode === 'chat' ? 'active' : ''}`}
            onClick={() => requestModeChange('chat')}
          >
            {NAV_CHAT}
          </button>
        </nav>

        <p className="section-desc">{sectionDesc}</p>

        <section className="workspace">
          {mode === 'docs' && (
            <div className="workspace-tabs" role="tablist" aria-label="Document actions">
              {DOCS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={docsTab === tab.id}
                  className={`workspace-tab ${docsTab === tab.id ? 'active' : ''}`}
                  onClick={() => setDocsTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="workspace-body">
            <PanelShell tabKey={activeTab}>
              {activeTab === 'ingest' && <IngestPanel />}
              {activeTab === 'ask' && <AskPanel />}
              {activeTab === 'chat' && <ChatPanel />}
            </PanelShell>
          </div>
        </section>

        <footer className="footer">
          <FooterTech />
          <p className="footer-credit">
            <span className="footer-credit-shine">Crafted by Saurabh Kumar</span>
          </p>
          <SocialLinks />
        </footer>
      </div>

      <NavigationGuardModal open={pendingMode !== null} onStay={handleStay} onLeave={handleLeave} />
    </div>
  );
}
