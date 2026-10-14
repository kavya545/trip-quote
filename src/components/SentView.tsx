import type { TripView } from '../model/useTripQuote';
import { MONO, SERIF, linkButton } from '../styles';

type Props = Pick<TripView, 'sentTitle' | 'sentPara' | 'hasChanges' | 'sentList' | 'sentTotalLabel' | 'total' | 'hasMessage' | 'message' | 'restart'>;

export function SentView(v: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, maxWidth: 780, margin: '24px auto 0', textAlign: 'center' }}>
      <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#3DAA4F', color: '#FFFFFF', display: 'grid', placeItems: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      <div style={{ fontFamily: SERIF, fontSize: 'clamp(32px,5vw,44px)', lineHeight: 1.05 }}>{v.sentTitle}</div>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: '#3E4145', margin: 0, textAlign: 'left', textWrap: 'pretty' }}>{v.sentPara}</p>
      <div style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E4E4E2', borderRadius: 16, overflow: 'hidden', textAlign: 'left' }}>
        {v.hasChanges && v.sentList.map(s => (
          <div key={s.head + s.detail} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px clamp(16px,3vw,26px)', borderBottom: '1px solid #E4E4E2', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 0 }}><div style={{ fontSize: 12, color: '#5F6266' }}>{s.head}</div><div style={{ fontSize: 15 }}>{s.detail}</div></div>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <span style={{ borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', background: s.stBg, color: s.stFg }}>{s.stLabel}</span>
              <span style={{ minWidth: 60, textAlign: 'right', display: 'flex', flexDirection: 'column', lineHeight: 1.25, color: s.color }}>
                <span style={{ fontFamily: MONO, fontWeight: 500 }}>{s.txt}</span>
                <span style={{ fontSize: 12 }}>{s.word}</span>
              </span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '28px 26px 24px' }}>
          <span style={{ fontSize: 14, color: '#5F6266' }}>{v.sentTotalLabel}</span>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{v.total}</span>
        </div>
      </div>
      {v.hasMessage && (
        <div style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E4E4E2', borderRadius: 16, padding: '20px 26px', textAlign: 'left' }}>
          <div style={{ fontSize: 12, color: '#5F6266' }}>Your note</div>
          <div style={{ fontSize: 15, marginTop: 4 }}>{v.message}</div>
        </div>
      )}
      <div style={{ fontSize: 14, color: '#5F6266' }}>This quotation is locked while Priya reviews it. To change anything else, reply to her email.</div>
      <button onClick={v.restart} style={linkButton({ fontSize: 15, fontWeight: 500 })}>Restart prototype</button>
    </div>
  );
}
