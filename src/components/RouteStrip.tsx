import type { TripView } from '../model/useTripQuote';
import { SERIF } from '../styles';
import { color } from '../tokens';

interface Badge { has: boolean; label: string }
interface Props { route: TripView['route']; homeCity: string; startDay: string; endDay: string }

const col = { display: 'flex', flexDirection: 'column', alignItems: 'center' } as const;

function Endpoint({ city, date }: { city: string; date: string }) {
  return (
    <div style={{ ...col, gap: 4, minWidth: 80 }}>
      <span style={{ width: 12, height: 12, border: `1.5px solid ${color.ink}`, borderRadius: '50%', margin: '8px 0 6px' }} />
      <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{city}</span>
      <span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{date}</span>
    </div>
  );
}

function City({ name, dates, badge }: { name: string; dates: string; badge: Badge }) {
  return (
    <div style={{ ...col, gap: 4, minWidth: 96 }}>
      <span style={{ fontFamily: SERIF, fontSize: '2rem', lineHeight: 1 }}>{name}</span>
      <span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{dates}</span>
      {badge.has && <span style={{ background: color.ink, color: color.white, borderRadius: 999, padding: '2px 10px', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{badge.label}</span>}
    </div>
  );
}

function Connector({ label, when, nowrap }: { label: string; when: string; nowrap?: boolean }) {
  const rule = <span style={{ flex: 1, height: 1, background: color.borderStrong }} />;
  return (
    <div style={{ ...col, gap: 6, paddingTop: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {rule}
        <span style={{ background: color.chip, borderRadius: 999, padding: '3px 10px', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
        {rule}
      </div>
      <span style={{ fontSize: '0.875rem', color: color.textSecondary, ...(nowrap ? { whiteSpace: 'nowrap' } : {}) }}>{when}</span>
    </div>
  );
}

/** Long connector labels ("Car + cruise · 6 h") get a wider minimum column, as in the design. */
const legColumn = (label: string) => `minmax(${label.length > 16 ? 140 : 120}px,1fr)`;

export function RouteStrip({ route, homeCity, startDay, endDay }: Props) {
  const columns = ['auto', ...route.map(r => r.kind === 'leg' ? legColumn(r.label) : 'auto'), 'auto'].join(' ');
  return (
    <section style={{ margin: '32px clamp(16px,4vw,40px)', background: color.white, borderRadius: 24, padding: 'clamp(20px,4vw,36px) clamp(20px,4vw,48px)', display: 'grid', gridTemplateColumns: columns, alignItems: 'start', gap: 12, overflowX: 'auto' }}>
      <Endpoint city={homeCity} date={startDay} />
      {route.map(r => r.kind === 'leg'
        ? <Connector key={r.key} label={r.label} when={r.when} nowrap={r.hasTime} />
        : <City key={r.key} name={r.name} dates={r.dates} badge={r.badge} />)}
      <Endpoint city={homeCity} date={endDay} />
    </section>
  );
}
