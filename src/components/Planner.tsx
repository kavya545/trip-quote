import type { TripView } from '../model/useTripQuote';
import { ChangesView } from './ChangesView';
import { SegmentCard } from './SegmentCard';
import { StopCard } from './StopCard';
import { SummaryPanel } from './SummaryPanel';

const tab = { border: 0, borderRadius: 999, padding: '8px 16px', fontSize: 14, fontWeight: 600, color: '#1E1F21', cursor: 'pointer' } as const;

export function Planner({ v }: { v: TripView }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px,3vw,40px)', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0, flex: '1 1 min(100%,600px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#E4E4E2', borderRadius: 999, padding: 4 }}>
            <button onClick={v.goTrip} style={{ ...tab, background: v.tabTripBg, boxShadow: v.tabTripSh }}>My trip</button>
            <button onClick={v.goChanges} style={{ ...tab, background: v.tabChangesBg, boxShadow: v.tabChangesSh, display: 'flex', alignItems: 'center', gap: 8 }}>
              What’s changed
              {v.hasChanges && <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: '#1E1F21', color: '#FFFFFF', fontSize: 11, display: 'grid', placeItems: 'center', padding: '0 6px' }}>{v.changeCount}</span>}
            </button>
          </div>
          {v.isChanges && <span style={{ fontSize: 14, color: '#5F6266' }}>Original quotation v1 vs. your revised version</span>}
          {v.isTrip && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#5F6266', marginRight: 2 }}>Show</span>
              {v.filters.map(f => (
                <button key={f.id} onClick={f.pick} style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', background: f.bg, color: f.fg, border: `1px solid ${f.bd}` }}>
                  {f.label}
                  {f.hasCount && <span style={{ minWidth: 18, height: 18, borderRadius: 999, fontSize: 11, display: 'grid', placeItems: 'center', padding: '0 5px', background: f.badgeBg, color: f.badgeFg }}>{f.count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {v.isTrip && v.blocks.map(b => b.isSeg
          ? <SegmentCard key={b.key} block={b} draft={v.draft} onDraft={v.onDraft} onCancel={v.cancelNote} />
          : <StopCard key={b.key} block={b} />)}

        {v.isChanges && <ChangesView compare={v.compare} noChanges={v.noChanges} />}
      </div>

      <SummaryPanel {...v} />
    </div>
  );
}
