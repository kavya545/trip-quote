import type { TripView } from '../model/useTripQuote';
import { color } from '../tokens';

export function StepBar({ steps }: { steps: TripView['steps'] }) {
  return (
    <div style={{ background: color.ink, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'safe center', gap: 18, padding: '0 24px', overflowX: 'auto' }}>
      {steps.map(st => (
        <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '0.8125rem', fontWeight: 700, background: st.bg, color: st.fg }}>{st.mark}</span>
          <span style={{ fontSize: '0.9375rem', whiteSpace: 'nowrap', fontWeight: st.labelWeight, color: st.labelColor }}>{st.label}</span>
          {st.notLast && <span style={{ width: 44, height: 1, background: color.textSecondary, marginLeft: 4 }} />}
        </div>
      ))}
    </div>
  );
}
