import { useState } from 'react';
import type { Scenario } from './api/mockApi';
import type { SaveMode } from './api/progressApi';
import { useQuote } from './api/useQuote';
import { Sidebar } from './components/Sidebar';
import { QuoteSkeleton, StatusMessage } from './components/StatusViews';
import { TripQuote } from './components/TripQuote';
import type { TripQuoteProps } from './model/useTripQuote';

export interface AppProps extends TripQuoteProps {
  quoteId: string;
  /** Forces a mock API response, e.g. to see the error state. */
  scenario?: Scenario;
  /** Fixed mock API delay in ms instead of the default short random one. */
  delayMs?: number;
  /** Simulated save behaviour: slow, failing or flaky writes. */
  saveMode?: SaveMode;
}

export default function App({ quoteId, scenario, delayMs, saveMode = 'ok', ...props }: AppProps) {
  const [navOpen, setNavOpen] = useState(false);
  const q = useQuote(quoteId, scenario, delayMs);
  const data = q.status === 'ready' ? q.data : null;
  const user = data && { ...data.user, subtitle: `${data.id} · ${data.region}` };

  return (
    <div className="app-shell" data-nav={navOpen ? 'open' : 'closed'} style={{ minHeight: '100vh', background: '#F2F2F2', color: '#1E1F21', fontFamily: 'Manrope,system-ui,sans-serif' }}>
      <Sidebar open={navOpen} onToggle={() => setNavOpen(o => !o)} user={user} />
      {q.status === 'loading' && <QuoteSkeleton />}
      {q.status === 'error' && (
        <StatusMessage kind="error" title="We couldn’t load your quotation" action={{ label: 'Try again', onClick: q.retry }}>
          {q.error.message} Check your connection and try again.
        </StatusMessage>
      )}
      {q.status === 'notfound' && (
        <StatusMessage kind="empty" title="We couldn’t find this quotation">
          The link may be out of date. Ask your travel planner to send it again.
        </StatusMessage>
      )}
      {data && data.isEmpty && (
        <StatusMessage kind="empty" title="Nothing in this quotation yet">
          {data.agentFirstName} is still putting your {data.region} trip together. You’ll get an email when it’s ready to review.
        </StatusMessage>
      )}
      {q.status === 'ready' && !q.data.isEmpty && <TripQuote data={q.data} quoteId={quoteId} progress={q.progress} saveMode={saveMode} {...props} />}
    </div>
  );
}
