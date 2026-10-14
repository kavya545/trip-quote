import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saveDraft, type SaveMode } from './progressApi';
import type { Draft } from './schema';

export type SaveState =
  | { state: 'idle' }
  /** `slow` turns true once a save has taken longer than SLOW_MS, so quick saves never flash an indicator. */
  | { state: 'saving'; slow: boolean }
  /** `recovered`: this save succeeded after an earlier one failed, so it's worth confirming. */
  | { state: 'saved'; recovered: boolean }
  | { state: 'error'; message: string };

const DEBOUNCE_MS = 400;
const SLOW_MS = 800;

/** Key-order-independent JSON, so the same draft always compares equal. */
const stable = (v: unknown): string => JSON.stringify(v, (_k, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);

/**
 * Saves the traveller's draft as they edit. Edits within DEBOUNCE_MS are saved together, only one
 * save is in flight at a time, and the newest draft always wins. A failed save keeps the draft
 * pending until `retry` or the next edit sends it.
 */
export function useAutosave(quoteId: string, mode: SaveMode) {
  const [status, setStatus] = useState<SaveState>({ state: 'idle' });
  const r = useRef({
    baseline: null as string | null, // last draft the server has (or the starting draft)
    pending: null as Draft | null,
    inFlight: false,
    inFlightJson: null as string | null,
    locked: false,
    paused: false, // after a failure, wait for Retry or the next edit instead of retrying on our own
    failedSince: false, // a save failed and nothing has succeeded since
    debounce: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const flush = useCallback(async () => {
    const s = r.current;
    clearTimeout(s.debounce);
    if (s.inFlight || s.locked || !s.pending) return;
    const draft = s.pending, json = stable(draft);
    s.pending = null; s.inFlight = true; s.inFlightJson = json;
    setStatus({ state: 'saving', slow: false });
    const slowTimer = setTimeout(() => setStatus(st => st.state === 'saving' ? { state: 'saving', slow: true } : st), SLOW_MS);
    try {
      await saveDraft(quoteId, draft, mode);
      s.baseline = json;
      if (!s.pending) { setStatus({ state: 'saved', recovered: s.failedSince }); s.failedSince = false; }
    } catch (e) {
      if (s.locked) return; // the quote was sent meanwhile; that request carried the latest draft
      s.pending ??= draft; s.paused = true; s.failedSince = true;
      setStatus({ state: 'error', message: e instanceof Error ? e.message : String(e) });
    } finally {
      clearTimeout(slowTimer);
      s.inFlight = false; s.inFlightJson = null;
      if (s.pending && !s.locked && !s.paused) void flush(); // newer edits arrived while saving
    }
  }, [quoteId, mode]);

  /** Queue a draft for saving. The first call only records the starting draft. */
  const queue = useCallback((draft: Draft) => {
    const s = r.current, json = stable(draft);
    if (s.locked) return;
    if (s.baseline === null) { s.baseline = json; return; }
    // Nothing new: already saved, or exactly what is being saved right now.
    if ((json === s.baseline && !s.inFlight) || json === s.inFlightJson) { s.pending = null; clearTimeout(s.debounce); return; }
    s.pending = draft;
    clearTimeout(s.debounce);
    s.debounce = setTimeout(() => { s.paused = false; void flush(); }, DEBOUNCE_MS);
  }, [flush]);

  const retry = useCallback(() => { r.current.paused = false; void flush(); }, [flush]);

  /** Stop autosaving, e.g. while the revision is being sent. */
  const lock = useCallback(() => { const s = r.current; s.locked = true; s.pending = null; clearTimeout(s.debounce); setStatus({ state: 'idle' }); }, []);
  /** Resume autosaving; `baseline` resets what counts as already saved. */
  const unlock = useCallback((baseline?: Draft) => {
    const s = r.current; s.locked = false;
    if (baseline) s.baseline = stable(baseline);
  }, []);

  // Warn before leaving with changes the server doesn't have yet.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      const s = r.current;
      if (!s.locked && (s.pending || s.inFlight)) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('beforeunload', onLeave); clearTimeout(r.current.debounce); };
  }, []);

  return useMemo(() => ({ status, queue, retry, lock, unlock }), [status, queue, retry, lock, unlock]);
}

export type Autosave = ReturnType<typeof useAutosave>;
