import type { CSSProperties, ReactNode } from 'react';
import { color } from '../tokens';

interface Props { photo: string; dots: { bg: string }[]; onNext: () => void; chip?: ReactNode; style?: CSSProperties }

/** Card photo with a top-left tag, a "next photo" arrow and position dots. */
export function PhotoCarousel({ photo, dots, onNext, chip, style }: Props) {
  return (
    <div style={{ position: 'relative', height: 'clamp(160px,30vw,200px)', borderRadius: 14, backgroundColor: color.inkSoft, backgroundImage: photo, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}>
      {chip != null && <span style={{ position: 'absolute', top: 12, left: 12, borderRadius: 999, padding: '4px 10px', fontSize: '0.8125rem', fontWeight: 500, background: color.white, color: color.ink }}>{chip}</span>}
      <button onClick={onNext} aria-label="Next photo" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 0, background: color.white, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
      </button>
      <span style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {dots.map((dt, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: dt.bg }} />)}
      </span>
    </div>
  );
}
