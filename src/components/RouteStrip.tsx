import { SERIF } from '../styles';

interface Badge { has: boolean; label: string }
interface Props { kochi: Badge; munnar: Badge; alleppey: Badge }

const col = { display: 'flex', flexDirection: 'column', alignItems: 'center' } as const;

function Endpoint({ date }: { date: string }) {
  return (
    <div style={{ ...col, gap: 4, minWidth: 80 }}>
      <span style={{ width: 12, height: 12, border: '1.5px solid #1E1F21', borderRadius: '50%', margin: '8px 0 6px' }} />
      <span style={{ fontSize: 15, fontWeight: 600 }}>Bengaluru</span>
      <span style={{ fontSize: 12, color: '#5F6266' }}>{date}</span>
    </div>
  );
}

function City({ name, dates, badge }: { name: string; dates: string; badge: Badge }) {
  return (
    <div style={{ ...col, gap: 4, minWidth: 96 }}>
      <span style={{ fontFamily: SERIF, fontSize: 32, lineHeight: 1 }}>{name}</span>
      <span style={{ fontSize: 13, color: '#5F6266' }}>{dates}</span>
      {badge.has && <span style={{ background: '#1E1F21', color: '#FFFFFF', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{badge.label}</span>}
    </div>
  );
}

function Connector({ label, when, nowrap }: { label: string; when: string; nowrap?: boolean }) {
  const rule = <span style={{ flex: 1, height: 1, background: '#CFCFCD' }} />;
  return (
    <div style={{ ...col, gap: 6, paddingTop: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {rule}
        <span style={{ background: '#EBEBEA', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
        {rule}
      </div>
      <span style={{ fontSize: 12, color: '#5F6266', ...(nowrap ? { whiteSpace: 'nowrap' } : {}) }}>{when}</span>
    </div>
  );
}

export function RouteStrip({ kochi, munnar, alleppey }: Props) {
  return (
    <section style={{ margin: '32px clamp(16px,4vw,40px)', background: '#FFFFFF', borderRadius: 24, padding: 'clamp(20px,4vw,36px) clamp(20px,4vw,48px)', display: 'grid', gridTemplateColumns: 'auto minmax(120px,1fr) auto minmax(120px,1fr) auto minmax(140px,1fr) auto minmax(120px,1fr) auto', alignItems: 'start', gap: 12, overflowX: 'auto' }}>
      <Endpoint date="Tue 10 Nov" />
      <Connector label="Flight · 1h 10m" when="10 Nov · 10:50" nowrap />
      <City name="Kochi" dates="10–12 Nov" badge={kochi} />
      <Connector label="Car · 4.5 h" when="12 Nov" />
      <City name="Munnar" dates="12–14 Nov" badge={munnar} />
      <Connector label="Car + cruise · 6 h" when="14 Nov" />
      <City name="Alleppey" dates="14–15 Nov" badge={alleppey} />
      <Connector label="Train + flight" when="15 Nov · 14:20" nowrap />
      <Endpoint date="Sun 15 Nov" />
    </section>
  );
}
