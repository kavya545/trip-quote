import type { StopBlock } from '../model/useTripQuote';
import { MONO, SERIF, linkButton } from '../styles';

const label = { fontSize: '0.875rem', color: '#5F6266' } as const;

export function StopCard({ block: b }: { block: StopBlock }) {
  const h = b.hotel;
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 236, backgroundColor: '#3E4145', backgroundImage: b.photo, backgroundSize: 'cover', backgroundPosition: 'center', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px 20px', padding: 'clamp(20px,3vw,28px) clamp(20px,4vw,36px)' }}>
        <button onClick={b.toggle} aria-label="Collapse" style={{ position: 'absolute', top: 18, right: 20, width: 40, height: 40, borderRadius: '50%', border: 0, background: '#FFFFFF', color: '#1E1F21', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: b.chevRot }}><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div><div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{b.kicker}</div><div style={{ fontFamily: SERIF, fontSize: 'clamp(2.375rem,5vw,3.375rem)', lineHeight: 1 }}>{b.name}</div></div>
        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '1rem', fontWeight: 700 }}>{b.dates}</div><div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{b.dayRange}</div></div>
      </div>
      <div style={{ padding: '12px clamp(16px,4vw,36px) 32px' }}>
        {b.showHotel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '24px 0 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#5F6266' }}>Where you’ll stay</span>
              {h.canSplit && <button onClick={h.openSplit} style={linkButton()}>Split stay</button>}
            </div>
            <div style={{ background: '#FAFAF9', border: `1px solid ${h.border}`, borderRadius: 20, display: 'flex', flexWrap: 'wrap', gap: 'clamp(16px,2.5vw,28px)', padding: 'clamp(14px,2vw,20px)' }}>
              <div style={{ borderRadius: 12, minHeight: 104, flex: '1 1 120px', maxWidth: 160, background: h.thumb }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, flex: '999 1 260px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}><div style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{h.name}</div><div style={{ fontSize: '0.875rem', color: '#5F6266' }}>{h.meta}</div></div>
                  <button onClick={h.open} className="hover-bg-f2" style={{ background: '#FFFFFF', border: '1px solid #CFCFCD', borderRadius: 999, padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#1E1F21', cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none' }}>{h.changeLabel}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '16px 20px', borderTop: '1px solid #E4E4E2', paddingTop: 16 }}>
                  <div><div style={label}>Room</div><div style={{ fontSize: '0.9375rem' }}>{h.room}</div></div>
                  <div><div style={label}>Meals</div><div style={{ fontSize: '0.9375rem' }}>{h.meals}</div></div>
                  <div><div style={label}>Nights</div><div style={{ fontSize: '0.9375rem' }}>{h.nightsTxt}</div></div>
                  <div><div style={label}>Price</div><div style={{ fontFamily: MONO, fontSize: '0.9375rem' }}>{h.price}</div></div>
                </div>
                {h.changed && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: '0.875rem', color: '#5F6266', textDecoration: 'line-through' }}>Was {h.was}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px 14px', flexWrap: 'wrap' }}>
                      {h.hasDelta && (
                        <span style={{ fontSize: '0.875rem', color: h.deltaColor, whiteSpace: 'nowrap' }}>
                          <span style={{ fontFamily: MONO, fontWeight: 600 }}>{h.deltaTxt}</span>{' ' + h.deltaWord.toLowerCase()}
                        </span>
                      )}
                      <span style={{ borderRadius: 999, padding: '4px 12px', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', background: h.stBg, color: h.stFg }}>{h.stLabel}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {b.showDays && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {b.days.map(d => (
              <div key={d.n} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 28px', padding: '28px 0', borderTop: '1px solid #E4E4E2' }}>
                <div style={{ flex: '0 0 128px' }}><div style={{ fontSize: '0.875rem', color: '#5F6266' }}>Day {d.n}</div><div style={{ fontFamily: SERIF, fontSize: '1.25rem', lineHeight: 1.2 }}>{d.date}</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, flex: '1 1 280px' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{d.title}</div>
                  {d.empty && <div style={{ fontSize: '0.875rem', color: '#5F6266' }}>Free time. No activities planned.</div>}
                  {/* Keyed by position, like the prototype: rows are reused in place when an activity is added,
                      so the browser doesn't scroll-anchor the page behind an open side panel. */}
                  {d.acts.map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#FAFAF9', border: '1px solid #E4E4E2', borderRadius: 16, padding: 'clamp(12px,2vw,16px) clamp(14px,2vw,20px)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <span style={{ width: 56, height: 56, borderRadius: 12, background: a.thumb, flex: 'none', opacity: a.thumbOpacity }} />
                        <div style={{ minWidth: 0 }}><div style={{ fontFamily: MONO, fontSize: '0.875rem', color: '#5F6266' }}>Activity · {a.time}</div><div style={{ fontSize: '1rem', color: a.nameColor }}>{a.name}</div></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        {a.isIncluded && <span style={{ fontSize: '0.875rem', color: '#5F6266' }}>{a.priceLabel}</span>}
                        {a.isAdded && <>
                          <span style={{ borderRadius: 999, padding: '4px 12px', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', background: a.stBg, color: a.stFg }}>{a.stLabel}</span>
                          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, color: '#B8433B' }}>
                            <span style={{ fontFamily: MONO, fontSize: '0.875rem', fontWeight: 600 }}>{a.deltaTxt}</span>
                            <span style={{ fontSize: '0.8125rem' }}>Higher</span>
                          </span>
                        </>}
                        <button onClick={a.onAction} style={linkButton()}>{a.actionLabel}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {b.hasAdd && (
              <div style={{ padding: '6px 0 0 clamp(0px,(100% - 440px) * 100,156px)' }}>
                <button onClick={b.openAdd} style={{ background: 'none', border: 0, padding: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1E1F21', cursor: 'pointer' }}>+ <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{b.addLabel}</span></button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
