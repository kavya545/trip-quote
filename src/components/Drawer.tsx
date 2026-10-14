import type { TripView } from '../model/useTripQuote';
import { SERIF } from '../styles';
import { ActivityDrawer } from './ActivityDrawer';
import { HotelDrawer } from './HotelDrawer';

type Props = Pick<TripView, 'drawerW' | 'drawerTitle' | 'drawerSub' | 'closeDrawer' | 'hd' | 'ad' | 'adultsLabel'>;

const segmented = { display: 'flex', background: '#EBEBEA', borderRadius: 999, padding: 4 } as const;
const segBtn = (bg: string) => ({ border: 0, borderRadius: 999, padding: '8px 18px', fontSize: 15, fontWeight: 500, color: '#1E1F21', cursor: 'pointer', whiteSpace: 'nowrap', background: bg } as const);
const hint = { fontSize: 14, color: '#5F6266' } as const;
const toolbar = { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } as const;

export function Drawer({ drawerW, drawerTitle, drawerSub, closeDrawer, hd, ad, adultsLabel }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={closeDrawer} style={{ position: 'absolute', inset: 0, background: 'rgba(30,31,33,.45)' }} />
      <div style={{ position: 'relative', width: `min(${drawerW},100%)`, height: '100%', background: '#F5F5F4', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(30,31,33,.18)' }}>
        <div style={{ background: '#FAFAF9', borderBottom: '1px solid #E4E4E2', padding: 'clamp(20px,3vw,32px) clamp(16px,3vw,36px) 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(26px,4vw,32px)', lineHeight: 1.05 }}>{drawerTitle}</div>
              <div style={{ fontSize: 14, color: '#5F6266', marginTop: 6 }}>{drawerSub}</div>
            </div>
            <button onClick={closeDrawer} aria-label="Close" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #CFCFCD', background: '#FFFFFF', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E1F21" strokeWidth="1.8"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {hd?.canSplit && (
            <div style={toolbar}>
              <div style={segmented}>
                <button onClick={hd.setOne} style={segBtn(hd.oneBg)}>One hotel</button>
                <button onClick={hd.setSplit} style={segBtn(hd.splitBg)}>Split stay</button>
              </div>
              <span style={hint}>{hd.splitHint}</span>
            </div>
          )}
          {ad?.multiDay && (
            <div style={toolbar}>
              <div style={segmented}>
                {ad.tabs.map(t => <button key={t.label} onClick={t.pick} style={segBtn(t.bg)}>{t.label}</button>)}
              </div>
              <span style={hint}>Same add-ons every day in {ad.city}. Pick a day, then add.</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(18px,3vw,28px) clamp(16px,3vw,36px) 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {hd && <HotelDrawer hd={hd} />}
          {ad && <ActivityDrawer ad={ad} adultsLabel={adultsLabel} />}
        </div>
      </div>
    </div>
  );
}
