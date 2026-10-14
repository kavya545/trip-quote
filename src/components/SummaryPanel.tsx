import type { TripView } from '../model/useTripQuote';
import { MONO, linkButton } from '../styles';
import { color } from '../tokens';

type Props = Pick<TripView,
  'totalWord' | 'perPerson' | 'total' | 'hasChanges' | 'noChanges' | 'totalDelta' | 'hasAwaiting' | 'awaitingTxt' |
  'goReview' | 'changeCount' | 'accept' | 'toggleAll' | 'toggleAllLabel' | 'cats' | 'agent' | 'adultsLabel' | 'origTotal' | 'accepting' | 'acceptError'>;

const legendPill = { borderRadius: 999, padding: '6px 0', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600 } as const;
const legendText = { fontSize: '0.875rem', color: color.textSecondary } as const;

export function SummaryPanel(v: Props) {
  return (
    <div className="planner-summary" style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24, minWidth: 0, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', overscrollBehavior: 'contain', scrollbarWidth: 'thin', paddingBottom: 4 }}>
      <div style={{ background: color.white, borderRadius: 20, padding: '24px 26px', display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '18px 18px', alignItems: 'center' }}>
        <span style={{ ...legendPill, background: color.chip }}>Locked price</span><span style={legendText}>Swap freely, this price is held for you</span>
        <span style={{ ...legendPill, background: color.ink, color: color.white }}>{`${v.agent} will confirm`}</span><span style={legendText}>Depends on availability, price may shift</span>
        <span style={{ ...legendPill, background: color.chip, color: color.textSecondary }}>Included</span><span style={legendText}>Flights and transfers are booked as planned</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: color.lower, textAlign: 'center' }}>↓ Lower</span><span style={legendText}>{`Cheaper than ${v.agent}’s original quote`}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: color.higher, textAlign: 'center' }}>↑ Higher</span><span style={legendText}>{`Costs more than ${v.agent}’s original quote`}</span>
      </div>
      <div style={{ background: color.white, borderRadius: 20, padding: '30px 30px 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '2px 12px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your trip total</span><span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{`${v.adultsLabel} · incl. GST`}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '4px 12px' }}>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{v.totalWord}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.875rem', color: color.textSecondary, whiteSpace: 'nowrap' }}>{v.perPerson} <span style={{ fontFamily: 'Manrope,sans-serif' }}>per person</span></div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: '2.125rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', marginLeft: 'auto' }}>{v.total}</div>
          </div>
          {/* On its own line so the larger text never wraps mid-phrase beside the total. */}
          {v.hasChanges && <div style={{ fontSize: '0.875rem', color: color.textSecondary, textAlign: 'right' }}><span style={{ fontFamily: MONO, fontWeight: 700, color: v.totalDelta.color, whiteSpace: 'nowrap' }}>{v.totalDelta.head}</span><span style={{ whiteSpace: 'nowrap' }}>{` · was ${v.origTotal}`}</span></div>}
        </div>
        {v.hasAwaiting && <div style={{ fontFamily: MONO, fontSize: '0.875rem', color: color.textSecondary, marginTop: -8 }}>Includes {v.awaitingTxt}{` awaiting ${v.agent}’s confirmation.`}</div>}
        {v.hasChanges && <button onClick={v.goReview} className="hover-bg-3e" style={{ height: 56, border: 0, borderRadius: 999, background: color.ink, color: color.white, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Review changes ({v.changeCount})</button>}
        {v.noChanges && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* The prototype renders disabled="" which React treats as not disabled; aria-disabled keeps that exact look. */}
            <button aria-disabled="true" style={{ height: 56, border: 0, borderRadius: 999, background: color.textMuted, color: color.white, fontSize: '1rem', fontWeight: 600, cursor: 'not-allowed' }}>Make a change to review</button>
            <button onClick={v.accept} disabled={v.accepting} className="hover-bg-f2" style={{ height: 48, border: `1px solid ${color.borderStrong}`, borderRadius: 999, background: color.white, color: color.ink, fontSize: '0.9375rem', fontWeight: 600 }}>{v.accepting ? 'Accepting…' : 'Accept quotation as sent'}</button>
            {v.acceptError && <div role="alert" style={{ fontSize: '0.875rem', color: color.higher, lineHeight: 1.5 }}>{`Not accepted yet. ${v.acceptError} Try again.`}</div>}
          </div>
        )}
        <div style={{ borderTop: `2px solid ${color.ink}`, paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={v.toggleAll} style={linkButton({ fontSize: '0.875rem' })}>{v.toggleAllLabel}</button>
        </div>
        {v.cats.map(k => (
          <div key={k.id} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20, borderBottom: `1px solid ${color.border}` }}>
            <button onClick={k.toggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 0, padding: 0, cursor: 'pointer', color: color.textSecondary, fontSize: '0.9375rem', fontWeight: 600, textAlign: 'left' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ transform: k.rot }}><path d="m6 9 6 6 6-6" /></svg>{k.title}
              </span>
              {k.collapsed && <span style={{ fontFamily: MONO, fontSize: '1rem', fontWeight: 600, color: color.ink }}>{k.total}</span>}
            </button>
            {k.expanded && k.lines.map(ln => (
              <div key={ln.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0 }}><div style={{ fontSize: '1rem', fontWeight: 500 }}>{ln.label}</div><div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{ln.sub}</div></div>
                <div style={{ textAlign: 'right', flex: 'none' }}>
                  <div style={{ fontFamily: MONO, fontSize: '1rem', fontWeight: 600 }}>{ln.price}</div>
                  {ln.changed && <div style={{ fontSize: '0.875rem', color: color.textSecondary, whiteSpace: 'nowrap' }}><span style={{ fontFamily: MONO, fontWeight: 700, color: ln.wasColor }}>{ln.wasHead}</span> · was {ln.orig}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
