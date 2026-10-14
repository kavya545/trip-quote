import type { ActDrawerView } from '../model/useTripQuote';
import { MONO, drawerButton, pill } from '../styles';
import { blurb, card, cardBody, cardHead } from './HotelDrawer';
import { PhotoCarousel } from './PhotoCarousel';
import { color } from '../tokens';

const time = { fontFamily: MONO, fontSize: '0.875rem', color: color.inkSoft } as const;

export function ActivityDrawer({ ad, adultsLabel }: { ad: ActDrawerView; adultsLabel: string }) {
  return <>
    {ad.included.map(a => (
      <div key={a.id} style={card(`2px solid ${color.ink}`)}>
        <PhotoCarousel photo={a.photo} dots={a.dots} onNext={a.nextPhoto} chip={`Selected · ${a.dayLabel}`} style={{ opacity: a.photoOpacity }} />
        <div style={cardBody}>
          <div style={cardHead}>
            <div style={{ minWidth: 0, flex: '1 1 180px' }}><div style={time}>{a.time}</div><div style={{ fontSize: '1.125rem', fontWeight: 500, textDecoration: a.deco }}>{a.name}</div></div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: '1.125rem', fontWeight: 600 }}>{a.price}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.8125rem', color: color.textSecondary }}>{a.creditTxt}</div>
            </div>
          </div>
          <div style={blurb}>{a.blurb}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={a.onToggle} className="hover-bg-f2" style={drawerButton({ whiteSpace: undefined })}>{a.btn}</button>
          </div>
        </div>
      </div>
    ))}
    {ad.options.map(o => (
      <div key={o.id} style={card(o.border)}>
        <PhotoCarousel photo={o.photo} dots={o.dots} onNext={o.nextPhoto} chip={o.added ? `Selected · ${o.dayShort}` : undefined} />
        <div style={cardBody}>
          <div style={cardHead}>
            <div style={{ minWidth: 0, flex: '1 1 180px' }}><div style={time}>{o.time}</div><div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{o.name}</div></div>
            <div style={{ textAlign: 'right', flex: 'none', lineHeight: 1.3 }}>
              <div style={{ fontFamily: MONO, fontSize: '1.125rem', fontWeight: 500, color: color.higher }}>{o.deltaTxt}</div>
              <div style={{ fontSize: '0.875rem', color: color.higher }}>Higher</div>
              <div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{`for ${adultsLabel}`}</div>
            </div>
          </div>
          <div style={blurb}>{o.blurb}</div>
          {o.hasWarn && <div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{o.warn}</div>}
          {o.hasConflict && <div style={{ background: color.errorBg, borderRadius: 6, padding: '10px 12px', fontSize: '0.875rem', color: color.higher }}>{o.conflict}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={pill(o.stBg, o.stFg)}>{o.stLabel}{o.extraSuffix}</span>
            <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {o.canMove && <button onClick={o.onMove} disabled={o.hasConflict} style={drawerButton({ cursor: o.addCursor })}>Move here</button>}
              {o.notAdded && <button onClick={o.onAdd} disabled={o.hasConflict} style={drawerButton({ border: 0, background: o.addBg, color: color.white, cursor: o.addCursor })}>Add · {o.deltaTxt}</button>}
              {o.added && <button onClick={o.onRemove} style={drawerButton()}>Remove</button>}
            </span>
          </div>
        </div>
      </div>
    ))}
  </>;
}
