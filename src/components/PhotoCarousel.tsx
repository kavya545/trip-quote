import type { CSSProperties, ReactNode } from 'react';

interface Props { photo: string; dots: { bg: string }[]; onNext: () => void; chip?: ReactNode; style?: CSSProperties }

/** Card photo with a top-left tag, a "next photo" arrow and position dots. */
export function PhotoCarousel({ photo, dots, onNext, chip, style }: Props) {
  return (
    <div style={{ position: 'relative', height: 'clamp(160px,30vw,200px)', borderRadius: 14, backgroundColor: '#3E4145', backgroundImage: photo, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}>
      {chip != null && <span style={{ position: 'absolute', top: 12, left: 12, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 500, background: '#FFFFFF', color: '#1E1F21' }}>{chip}</span>}
      <button onClick={onNext} aria-label="Next photo" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 0, background: '#FFFFFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E1F21" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
      </button>
      <span style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
        {dots.map((dt, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: dt.bg }} />)}
      </span>
    </div>
  );
}
