import { MONO, SERIF } from '../styles';

interface Props { quoteLabel: string; perPerson: string; totalLine: string }

const FACTS = [
  ['Duration', '6 days · 5 nights'],
  ['Dates', 'Tue 10 – Sun 15 Nov 2026'],
  ['Travellers', '2 adults'],
  ['Includes', 'Flights, stays, transfers, activities'],
];

export function Hero({ quoteLabel, perPerson, totalLine }: Props) {
  return (
    <section style={{ position: 'relative', minHeight: 'clamp(380px,50vw,470px)', borderRadius: '0 0 28px 28px', overflow: 'hidden', backgroundColor: '#1E1F21', backgroundImage: 'linear-gradient(180deg,rgba(30,31,33,.15) 0%,rgba(30,31,33,.45) 45%,rgba(30,31,33,.88) 100%),url(assets/hero-backwaters.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 60%', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '56px clamp(28px,5vw,76px) 52px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Your 6-day escape to Kerala</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(38px,6vw,64px)', lineHeight: 1.02, margin: '10px 0 12px', letterSpacing: '-0.01em' }}>Kerala: coast, tea hills &amp; backwaters</h1>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Prepared for Ananya &amp; Rohan by Priya Nair · Sent Mon 28 Sep</div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: 'auto', maxWidth: '100%' }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{quoteLabel}</div>
          <div style={{ fontFamily: MONO, fontSize: 'clamp(28px,4.5vw,42px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {perPerson} <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: 17, fontWeight: 600 }}>/ person</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 13, opacity: 0.85 }}>{totalLine}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,140px),1fr))', gap: 16, borderTop: '1px solid rgba(255,255,255,.35)', marginTop: 36, paddingTop: 22 }}>
        {FACTS.map(([k, v]) => (
          <div key={k}><div style={{ fontSize: 12, opacity: 0.75 }}>{k}</div><div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{v}</div></div>
        ))}
      </div>
    </section>
  );
}
