import { Fragment } from 'react';
import type { TripView } from '../model/useTripQuote';
import { MONO, SERIF, linkButton } from '../styles';

type Props = Pick<TripView, 'goTrip' | 'reviewCats' | 'total' | 'totalDelta' | 'hasNotes' | 'notesList' | 'message' | 'onMessage' | 'send' | 'agent' | 'adultsLabel' | 'origTotal'>;

const row = { display: 'grid', gridTemplateColumns: 'minmax(min(100%,220px),1fr) repeat(3,minmax(84px,140px))', gap: '12px clamp(12px,2vw,24px)' } as const;
const pad = 'clamp(16px,3vw,32px)';

export function ReviewView(v: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <button onClick={v.goTrip} style={linkButton({ alignSelf: 'flex-start', fontWeight: 500 })}>← Back to itinerary</button>
      <div>
        <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(2.125rem,5vw,2.875rem)', lineHeight: 1.05 }}>Review your changes</h1>
        <div style={{ fontSize: '0.9375rem', color: '#5F6266', marginTop: 8 }}>{`Your revised quotation next to ${v.agent}’s original. Changed lines are highlighted.`}</div>
      </div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E2', borderRadius: 16, overflowX: 'auto' }}>
        <div style={{ ...row, padding: `28px ${pad} 8px`, fontSize: '0.875rem', color: '#5F6266' }}>
          <span /><span style={{ textAlign: 'right' }}>{`${v.agent}’s plan`}</span><span style={{ textAlign: 'right' }}>Your version</span><span style={{ textAlign: 'right' }}>Difference</span>
        </div>
        {v.reviewCats.map(k => (
          <Fragment key={k.id}>
            <div style={{ padding: `32px ${pad} 14px`, fontSize: '1rem', fontWeight: 600 }}>{k.title}</div>
            {k.lines.map(ln => (
              <div key={ln.label} style={{ ...row, padding: `20px ${pad}`, borderTop: '1px solid #E4E4E2', background: ln.bg, fontSize: '0.875rem', alignItems: 'start' }}>
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{ln.label}</span>
                    {ln.hasStatus && <span style={{ borderRadius: 999, padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.8125rem', background: ln.stBg, color: ln.stFg }}>{ln.stLabel}</span>}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#5F6266' }}>{ln.sub}</div>
                  {ln.hasDesc && <div style={{ fontSize: '0.875rem', color: '#1E1F21' }}>{ln.desc}</div>}
                </div>
                <div style={{ fontFamily: MONO, textAlign: 'right', color: '#5F6266' }}>{ln.orig}</div>
                <div style={{ fontFamily: MONO, textAlign: 'right', fontWeight: ln.priceWeight }}>{ln.price}</div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', lineHeight: 1.25, color: ln.diffColor }}>
                  <span style={{ fontFamily: MONO, fontWeight: 600 }}>{ln.diffTxt}</span>
                  <span style={{ fontSize: '0.875rem' }}>{ln.diffWord}</span>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
        <div style={{ ...row, padding: `26px ${pad} 28px`, borderTop: '2px solid #1E1F21', alignItems: 'end' }}>
          <div><div style={{ fontSize: '1rem', fontWeight: 600 }}>Trip total</div><div style={{ fontSize: '0.875rem', color: '#5F6266' }}>{`${v.adultsLabel} · incl. GST`}</div></div>
          <div style={{ fontFamily: MONO, textAlign: 'right', color: '#5F6266', fontSize: '1rem' }}>{v.origTotal}</div>
          <div style={{ fontFamily: MONO, textAlign: 'right', fontSize: '1.1875rem', fontWeight: 700 }}>{v.total}</div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', lineHeight: 1.25, color: v.totalDelta.color }}>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: '1rem' }}>{v.totalDelta.txt}</span>
            <span style={{ fontSize: '0.875rem' }}>{v.totalDelta.word}</span>
          </div>
        </div>
      </div>
      {v.hasNotes && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E4E4E2', borderRadius: 16, padding: `clamp(18px,3vw,26px) ${pad}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: '0.875rem', color: '#5F6266' }}>{`Your notes for ${v.agent}`}</div>
          {v.notesList.map(n => (
            <div key={n.id}><div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{n.where}</div><div style={{ fontSize: '0.875rem' }}>“{n.text}”</div></div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{`Message to ${v.agent} `}<span style={{ fontWeight: 400, color: '#5F6266' }}>(optional)</span></label>
        <textarea placeholder={`Anything ${v.agent} should know, e.g. flexibility on dates or a budget limit`} value={v.message} onChange={v.onMessage} style={{ minHeight: 118, background: '#FFFFFF', border: '1px solid #CFCFCD', borderRadius: 14, padding: '14px 16px', fontSize: '0.875rem', resize: 'vertical', color: '#1E1F21' }} />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={v.send} className="hover-bg-3e" style={{ height: 48, padding: '0 22px', border: 0, borderRadius: 999, background: '#1E1F21', color: '#FFFFFF', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer' }}>{`Send revised quotation to ${v.agent}`}</button>
        <button onClick={v.goTrip} className="hover-bg-f2" style={{ height: 48, padding: '0 20px', border: '1px solid #CFCFCD', borderRadius: 999, background: '#FFFFFF', color: '#1E1F21', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer' }}>Keep editing</button>
        <span style={{ fontSize: '0.875rem', color: '#5F6266' }}>{`You won’t be charged. ${v.agent} confirms before anything is booked.`}</span>
      </div>
    </div>
  );
}
