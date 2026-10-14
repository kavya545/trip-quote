import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tokens.css';
import './index.css';
import App from './App';
import type { Scenario } from './api/mockApi';
import type { SaveMode } from './api/progressApi';

// Mock API controls for trying the loading, empty and error states:
//   ?scenario=error | empty | notfound   ?delay=3000   ?quote=Q-2481
// and the save states:  ?save=slow | fail | flaky
const params = new URLSearchParams(window.location.search);
const delay = params.get('delay');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      quoteId={params.get('quote') ?? 'Q-2481'}
      scenario={(params.get('scenario') as Scenario | null) ?? undefined}
      delayMs={delay ? Number(delay) : undefined}
      saveMode={(params.get('save') as SaveMode | null) ?? undefined}
    />
  </StrictMode>,
);
