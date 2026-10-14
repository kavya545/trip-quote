import type { TripView } from '../model/useTripQuote';
import { MONO, SERIF, linkButton } from '../styles';
import { color } from '../tokens';

type Props = Pick<TripView, 'sentTitle' | 'sentPara' | 'hasChanges' | 'sentList' | 'sentTotalLabel' | 'total' | 'hasMessage' | 'message' | 'restart' | 'restarting' | 'agent' | 'agentPossessive'>;

export function SentView(v: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, maxWidth: 780, margin: '24px auto 0', textAlign: 'center' }}>
      <span style={{ width: 56, height: 56, borderRadius: '50%', background: color.success, color: color.white, display: 'grid', placeItems: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      <div style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,5vw,2.75rem)', lineHeight: 1.05 }}>{v.sentTitle}</div>
      <p style={{ fontSize: '1rem', lineHeight: 1.6, color: color.inkSoft, margin: 0, textAlign: 'left', textWrap: 'pretty' }}>{v.sentPara}</p>
      <div style={{ width: '100%', background: color.white, border: `1px solid ${color.border}`, borderRadius: 16, overflow: 'hidden', textAlign: 'left' }}>
        {v.hasChanges && v.sentList.map(s => (
          <div key={s.head + s.detail} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px clamp(16px,3vw,26px)', borderBottom: `1px solid ${color.border}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 0 }}><div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{s.head}</div><div style={{ fontSize: '0.9375rem' }}>{s.detail}</div></div>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <span style={{ borderRadius: 999, padding: '3px 10px', fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap', background: s.stBg, color: s.stFg }}>{s.stLabel}</span>
              <span style={{ minWidth: 60, textAlign: 'right', display: 'flex', flexDirection: 'column', lineHeight: 1.25, color: s.color }}>
                <span style={{ fontFamily: MONO, fontWeight: 500 }}>{s.txt}</span>
                <span style={{ fontSize: '0.875rem' }}>{s.word}</span>
              </span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '28px 26px 24px' }}>
          <span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{v.sentTotalLabel}</span>
          <span style={{ fontFamily: MONO, fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{v.total}</span>
        </div>
      </div>
      {v.hasMessage && (
        <div style={{ width: '100%', background: color.white, border: `1px solid ${color.border}`, borderRadius: 16, padding: '20px 26px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.875rem', color: color.textSecondary }}>Your note</div>
          <div style={{ fontSize: '0.9375rem', marginTop: 4 }}>{v.message}</div>
        </div>
      )}
      <div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{`This quotation is locked while ${v.agent} reviews it. To change anything else, reply to ${v.agentPossessive} email.`}</div>
      <button onClick={v.restart} disabled={v.restarting} style={linkButton({ fontSize: '0.9375rem', fontWeight: 500, cursor: undefined })}>{v.restarting ? 'Restarting…' : 'Restart prototype'}</button>
    </div>
  );
}
