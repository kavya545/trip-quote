import type { CSSProperties, ReactNode } from 'react';
import { SERIF } from '../styles';

const block = (s: CSSProperties = {}) => ({ background: '#E4E4E2', ...s });

/** Placeholder in the shape of the itinerary page, shown while the quotation loads. */
export function QuoteSkeleton() {
  return (
    <main style={{ minWidth: 0 }} aria-busy="true">
      <span role="status" className="visually-hidden">Loading your quotation…</span>
      <div style={{ minHeight: 68, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px clamp(16px,3vw,32px)' }}>
        <span className="skeleton" style={block({ width: 'min(300px,60%)', height: 34, borderRadius: 999 })} />
        <span className="skeleton" style={block({ width: 36, height: 36, borderRadius: '50%' })} />
      </div>
      <div className="skeleton" style={block({ minHeight: 'clamp(380px,50vw,470px)', borderRadius: '0 0 28px 28px', background: '#D9D9D7' })} />
      <div className="skeleton" style={block({ margin: '32px clamp(16px,4vw,40px)', height: 148, borderRadius: 24, background: '#FFFFFF' })} />
      <div style={{ background: '#1E1F21', height: 68 }} />
      <div className="trip-content" style={{ padding: 'clamp(28px,4vw,48px) clamp(16px,4vw,40px) 112px' }}><div className="planner">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0 }}>
          <span className="skeleton" style={block({ width: 240, height: 44, borderRadius: 999 })} />
          <span className="skeleton" style={block({ height: 220, borderRadius: 24 })} />
          <span className="skeleton" style={block({ height: 420, borderRadius: 22, background: '#FFFFFF' })} />
        </div>
        <div className="planner-summary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span className="skeleton" style={block({ height: 210, borderRadius: 20, background: '#FFFFFF' })} />
          <span className="skeleton" style={block({ height: 360, borderRadius: 20, background: '#FFFFFF' })} />
        </div>
      </div></div>
    </main>
  );
}

const ICONS = {
  error: <path d="M12 8v5M12 16.5v.5M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  empty: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>,
};

interface MessageProps { kind: 'error' | 'empty'; title: string; children: ReactNode; action?: { label: string; onClick: () => void } }

/** Centred message for the empty, not-found and error states. */
export function StatusMessage({ kind, title, children, action }: MessageProps) {
  return (
    <main style={{ minWidth: 0, padding: 'clamp(48px,10vw,120px) clamp(16px,4vw,40px)' }}>
      <div role={kind === 'error' ? 'alert' : 'status'} style={{ maxWidth: 520, margin: '0 auto', background: '#FFFFFF', borderRadius: 24, padding: 'clamp(28px,5vw,44px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <span style={{ width: 56, height: 56, borderRadius: '50%', background: kind === 'error' ? '#FBE9E7' : '#F2F2F0', color: kind === 'error' ? '#B8433B' : '#1E1F21', display: 'grid', placeItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[kind]}</svg>
        </span>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(28px,4vw,36px)', lineHeight: 1.1 }}>{title}</h1>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: '#5F6266', textWrap: 'pretty' }}>{children}</div>
        {action && <button onClick={action.onClick} className="hover-bg-3e" style={{ marginTop: 8, height: 48, padding: '0 22px', border: 0, borderRadius: 999, background: '#1E1F21', color: '#FFFFFF', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{action.label}</button>}
      </div>
    </main>
  );
}
