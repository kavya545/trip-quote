import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import type { Scenario } from './api/mockApi';

// Mock API controls for trying the loading, empty and error states:
//   ?scenario=error | empty | notfound   ?delay=3000   ?quote=Q-2481
const params = new URLSearchParams(window.location.search);
const delay = params.get('delay');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      quoteId={params.get('quote') ?? 'Q-2481'}
      scenario={(params.get('scenario') as Scenario | null) ?? undefined}
      delayMs={delay ? Number(delay) : undefined}
    />
  </StrictMode>,
);
