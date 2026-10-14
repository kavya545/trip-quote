import { useEffect, useState } from 'react';
import type { SaveState } from '../api/useAutosave';

const pill = { position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 90, display: 'flex', alignItems: 'center', gap: '10px 14px', flexWrap: 'wrap', justifyContent: 'center', background: '#1E1F21', color: '#FFFFFF', borderRadius: 24, padding: '10px 14px 10px 16px', boxShadow: '0 10px 30px rgba(30,31,33,.28)', maxWidth: 'calc(100vw - 32px)', fontSize: '0.875rem', fontWeight: 500 } as const;

/**
 * Save feedback at the top of the screen. Normal saves are quick and show nothing; this appears only
 * when a save is slow, when it fails (with Retry), and briefly once a failed save goes through.
 */
export function SaveStatus({ status, onRetry }: { status: SaveState; onRetry: () => void }) {
  const [showSaved, setShowSaved] = useState(false);
  useEffect(() => {
    if (status.state !== 'saved' || !status.recovered) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2500);
    return () => clearTimeout(t);
  }, [status]);

  if (status.state === 'saving' && status.slow) return (
    <div role="status" style={pill}>
      <span className="save-spinner" aria-hidden="true" />Saving your changes…
    </div>
  );
  if (status.state === 'error') return (
    <div role="alert" style={pill}>
      <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: '#B8433B', display: 'grid', placeItems: 'center', fontWeight: 700, flex: 'none' }}>!</span>
      <span>Your last change wasn’t saved.</span>
      <button onClick={onRetry} className="hover-bg-e4" style={{ background: '#FFFFFF', color: '#1E1F21', border: 0, borderRadius: 999, padding: '7px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Retry</button>
    </div>
  );
  if (showSaved) return (
    <div role="status" style={pill}>
      <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: '50%', background: '#3DAA4F', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
      </span>All changes saved
    </div>
  );
  return null;
}
