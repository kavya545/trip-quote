import type { TripView } from '../model/useTripQuote';
import { MONO, SERIF } from '../styles';

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,130px),1fr))' } as const;

export function ChangesView({ compare, noChanges, agent }: { compare: TripView['compare']; noChanges: boolean; agent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ ...grid, gap: '8px 24px', fontSize: '0.875rem', color: '#5F6266', padding: '4px clamp(16px,3vw,28px) 0' }}>
        <span /><span>Original · v1</span><span>Revised</span><span style={{ textAlign: 'right' }}>Difference</span>
      </div>
      {noChanges && <div style={{ fontSize: '0.875rem', color: '#5F6266', padding: '0 20px' }}>{`No changes yet. This is ${agent}’s plan as sent.`}</div>}
      {compare.map(c => (
        <div key={c.title} style={{ background: '#FFFFFF', border: '1px solid #E4E4E2', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ background: '#F2F2F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', padding: 'clamp(16px,2.5vw,22px) clamp(16px,3vw,28px)' }}>
            <div><div style={{ fontSize: '0.875rem', color: '#5F6266' }}>{c.kicker}</div><div style={{ fontFamily: SERIF, fontSize: '1.625rem', lineHeight: 1.15 }}>{c.title}</div></div>
            <span style={{ fontSize: '0.875rem', color: '#5F6266' }}>{c.dates}</span>
          </div>
          {c.rows.map(r => (
            <div key={r.label + r.orig} style={{ ...grid, gap: '10px 24px', padding: 'clamp(14px,2.5vw,20px) clamp(16px,3vw,28px)', borderTop: '1px solid #E4E4E2', background: r.bg, fontSize: '0.875rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.875rem', color: '#5F6266' }}>{r.label}</span>
                {r.hasChip && <span style={{ borderRadius: 999, padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.8125rem', background: r.chipBg, color: r.chipFg }}>{r.chip}</span>}
              </div>
              <div style={{ color: '#5F6266', textDecoration: r.origDeco }}>{r.orig}</div>
              <div>
                <div style={{ fontWeight: r.revWeight }}>{r.rev}</div>
                {r.hasRevNote && <div style={{ fontWeight: 500 }}>Note: “{r.revNote}”</div>}
              </div>
              <div style={{ fontFamily: MONO, textAlign: 'right', fontWeight: 500, color: r.diffColor }}>{r.diffTxt} {r.diffWord}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
