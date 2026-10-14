import { MONO } from '../styles';

interface Props { msg: string; total: string; onUndo: () => void; onClose: () => void }

export function Toast({ msg, total, onUndo, onClose }: Props) {
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', left: '50%', bottom: 'clamp(16px,3vw,32px)', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px 16px', background: '#1E1F21', color: '#FFFFFF', borderRadius: 24, padding: '12px 14px 12px 18px', width: 'max-content', boxShadow: '0 10px 30px rgba(30,31,33,.28)', maxWidth: 'calc(100vw - 48px)' }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#3DAA4F', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{msg}</span>
      <span style={{ fontSize: '0.875rem', color: '#B5B7BA', whiteSpace: 'nowrap' }}>Total <span style={{ fontFamily: MONO, color: '#FFFFFF' }}>{total}</span></span>
      <button onClick={onUndo} className="hover-bg-e4" style={{ background: '#FFFFFF', color: '#1E1F21', border: 0, borderRadius: 999, padding: '7px 14px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Undo</button>
      <button onClick={onClose} aria-label="Dismiss" style={{ background: 'none', border: 0, color: '#B5B7BA', cursor: 'pointer', padding: 4, display: 'grid', placeItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}
