import type { TripData } from '../model/data';
import { MONO, SERIF } from '../styles';
import { alpha, color } from '../tokens';

interface Props { trip: TripData; quoteLabel: string; perPerson: string; totalLine: string }

export function Hero({ trip, quoteLabel, perPerson, totalLine }: Props) {
  const facts = [
    ['Duration', `${trip.days} days · ${trip.nights} nights`],
    ['Dates', trip.dates],
    ['Travellers', trip.adultsLabel],
    ['Includes', trip.includes],
  ];
  return (
    <section style={{ position: 'relative', minHeight: 'clamp(380px,50vw,470px)', borderRadius: '0 0 28px 28px', overflow: 'hidden', backgroundColor: color.ink, backgroundImage: `linear-gradient(180deg,${alpha(color.ink, 0.15)} 0%,${alpha(color.ink, 0.45)} 45%,${alpha(color.ink, 0.88)} 100%),url(${trip.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center 60%', color: color.white, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '56px clamp(28px,5vw,76px) 52px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{`Your ${trip.days}-day escape to ${trip.region}`}</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(2.375rem,6vw,4rem)', lineHeight: 1.02, margin: '10px 0 12px', letterSpacing: '-0.01em' }}>{trip.title}</h1>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{`Prepared for ${trip.travellerNames} by ${trip.agentName} · Sent ${trip.sentOn}`}</div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: 'auto', maxWidth: '100%' }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.85 }}>{quoteLabel}</div>
          <div style={{ fontFamily: MONO, fontSize: 'clamp(1.75rem,4.5vw,2.625rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {perPerson} <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: '1.0625rem', fontWeight: 600 }}>/ person</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: '0.875rem', opacity: 0.85 }}>{totalLine}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,140px),1fr))', gap: 16, borderTop: `1px solid ${alpha(color.white, 0.35)}`, marginTop: 36, paddingTop: 22 }}>
        {facts.map(([k, v]) => (
          <div key={k}><div style={{ fontSize: '0.875rem', opacity: 0.75 }}>{k}</div><div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: 2 }}>{v}</div></div>
        ))}
      </div>
    </section>
  );
}
