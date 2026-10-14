import type { TripView } from '../model/useTripQuote';

export function StepBar({ steps }: { steps: TripView['steps'] }) {
  return (
    <div style={{ background: '#1E1F21', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'safe center', gap: 18, padding: '0 24px', overflowX: 'auto' }}>
      {steps.map(st => (
        <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, background: st.bg, color: st.fg }}>{st.mark}</span>
          <span style={{ fontSize: 15, whiteSpace: 'nowrap', fontWeight: st.labelWeight, color: st.labelColor }}>{st.label}</span>
          {st.notLast && <span style={{ width: 44, height: 1, background: '#5F6266', marginLeft: 4 }} />}
        </div>
      ))}
    </div>
  );
}
