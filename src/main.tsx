import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PendingRequestProvider } from './context/PendingRequestContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PendingRequestProvider>
      <App />
    </PendingRequestProvider>
  </StrictMode>,
);
