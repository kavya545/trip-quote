import { useCallback, useEffect, useState } from 'react';
import type { TripData } from '../model/data';
import { deriveTrip } from '../model/derive';
import { fetchQuote, type Scenario } from './mockApi';

export type QuoteState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'notfound' }
  | { status: 'ready'; data: TripData };

/** Loads a quotation through the mock API. `retry` repeats the request. */
export function useQuote(id: string, scenario?: Scenario, delayMs?: number) {
  const [state, setState] = useState<QuoteState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });
    fetchQuote(id, { signal: ac.signal, scenario, delayMs })
      .then(q => setState(q ? { status: 'ready', data: deriveTrip(q) } : { status: 'notfound' }))
      .catch((e: unknown) => { if (!ac.signal.aborted) setState({ status: 'error', error: e instanceof Error ? e : new Error(String(e)) }); });
    return () => ac.abort();
  }, [id, scenario, delayMs, attempt]);

  const retry = useCallback(() => setAttempt(a => a + 1), []);
  return { ...state, retry };
}
