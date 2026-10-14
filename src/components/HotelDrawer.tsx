import type { HotelDrawerView } from '../model/useTripQuote';
import { MONO, drawerButton, pill } from '../styles';
import { PhotoCarousel } from './PhotoCarousel';
import { color } from '../tokens';

export const card = (border: string) => ({ background: color.white, border, borderRadius: 20, padding: '14px 14px 24px', display: 'flex', flexDirection: 'column', gap: 16 } as const);
export const cardBody = { padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 12 } as const;
export const cardHead = { display: 'flex', justifyContent: 'space-between', gap: '8px 12px', alignItems: 'flex-start', flexWrap: 'wrap' } as const;
export const blurb = { fontSize: '0.9375rem', color: color.inkSoft, textWrap: 'pretty' } as const;

export function HotelDrawer({ hd }: { hd: HotelDrawerView }) {
  return <>
    {hd.modeSplit && (
      <div style={{ background: color.white, border: `1px solid ${color.border}`, borderRadius: 20, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>Night by night</div>
        {hd.nights.map(nt => (
          <div key={nt.label} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,140px),1fr))', gap: '8px 12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{nt.label}</span>
            <select value={nt.value} onChange={nt.onChange} style={{ height: 46, border: `1px solid ${color.borderStrong}`, borderRadius: 10, padding: '0 12px', fontSize: '0.9375rem', background: color.white, color: color.ink }}>
              {hd.nightOpts.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        ))}
        <div style={{ fontFamily: MONO, fontSize: '0.875rem', color: color.textSecondary }}>{hd.splitCalc}</div>
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {hd.options.map(h => (
        <div key={h.id} style={card(h.border)}>
          <PhotoCarousel photo={h.photo} dots={h.dots} onNext={h.nextPhoto} chip={h.hasChip ? h.chip : undefined} />
          <div style={cardBody}>
            <div style={cardHead}>
              <div style={{ minWidth: 0, flex: '1 1 180px' }}><div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{h.meta} · {h.meals}</div><div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{h.name}</div></div>
              <div style={{ textAlign: 'right', flex: 'none' }}>
                <div style={{ fontFamily: MONO, fontSize: '1.125rem', fontWeight: 600 }}>{h.priceTotal}</div>
                {h.hasVs && <div style={{ fontFamily: MONO, fontSize: '0.8125rem', color: h.vsColor }}>{h.vsTxt}</div>}
              </div>
            </div>
            <div style={blurb}>{h.blurb}</div>
            {hd.modeOne && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 110px', gap: 10 }}>
                <select value={h.roomId} onChange={h.onRoom} aria-label="Room type" style={{ height: 42, border: `1px solid ${color.borderStrong}`, borderRadius: 10, padding: '0 12px', fontSize: '0.875rem', background: color.white, color: color.ink, minWidth: 0 }}>
                  {h.roomOpts.map(ro => <option key={ro.id} value={ro.id}>{ro.label}</option>)}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${color.borderStrong}`, borderRadius: 10, height: 42, padding: '0 4px' }}>
                  <button onClick={hd.dec} disabled={hd.rooms <= 1} aria-label="Fewer rooms" style={{ width: 30, height: 30, border: 0, background: 'none', fontSize: '1rem', color: color.ink }}>−</button>
                  <span style={{ fontFamily: MONO, fontSize: '0.875rem' }}>{hd.rooms} rm</span>
                  <button onClick={hd.inc} aria-label="More rooms" style={{ width: 30, height: 30, border: 0, background: 'none', fontSize: '1rem', color: color.ink, cursor: 'pointer' }}>+</button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={pill(h.stBg, h.stFg)}>{h.stLabel}</span>
                {h.features.map(ft => <span key={ft} style={pill(color.surfaceAlt, color.ink)}>{ft}</span>)}
              </span>
              {hd.modeOne && h.notSelected && <button onClick={h.choose} style={drawerButton({ border: 0, background: color.ink, color: color.white })}>{h.chooseLabel}</button>}
              {hd.modeOne && h.selected && (
                <span style={{ height: 42, padding: '0 18px', border: `1px solid ${color.borderStrong}`, borderRadius: 999, background: color.white, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9375rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>Selected
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </>;
}
