import type { ReactNode } from 'react';
import { SERIF } from '../styles';

const ICON = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const NAV: { label: string; active?: boolean; icon: ReactNode }[] = [
  { label: 'Trips', icon: <svg {...ICON}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg> },
  { label: 'Quotes', active: true, icon: <svg {...ICON}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M10 13h4M10 17h4" /></svg> },
  { label: 'Saved', icon: <svg {...ICON}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></svg> },
  { label: 'Messages', icon: <svg {...ICON}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { label: 'Profile', icon: <svg {...ICON}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg> },
];

interface Props {
  open: boolean; onToggle: () => void;
  /** Signed-in traveller; null while the quote is loading. */
  user: { name: string; initials: string; subtitle: string } | null;
}

export function Sidebar({ open, onToggle, user }: Props) {
  const padX = open ? '16px' : '12px', justify = open ? 'flex-start' : 'center';
  const toggleLabel = open ? 'Collapse menu' : 'Expand menu', chevron = open ? 'm16 15-3-3 3-3' : 'm14 9 3 3-3 3';
  return (
    <aside style={{ background: '#FFFFFF', borderRight: '1px solid #E4E4E2', padding: `24px ${padX}`, display: 'flex', flexDirection: 'column', gap: 28, overflow: 'hidden', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: 10, minHeight: 40, padding: '0 4px' }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: '#1E1F21', color: '#FFFFFF', display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 700, flex: 'none' }}>≈</span>
        {open && <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}><span style={{ fontFamily: SERIF, fontSize: 26, lineHeight: 1 }}>monsoon trails</span></div>}
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {open && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#98989B', padding: '0 8px 6px' }}>MENU</div>}
        {NAV.map(item => (
          <a
            key={item.label}
            href="#"
            title={item.label}
            className={item.active ? undefined : 'hover-bg-f2'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: 12, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: item.active ? 600 : 500, color: item.active ? '#FFFFFF' : '#1E1F21', ...(item.active ? { background: '#1E1F21' } : {}) }}
          >
            {item.icon}
            {open && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </a>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: justify, padding: '0 4px' }}>
        <button onClick={onToggle} aria-label={toggleLabel} title={toggleLabel} className="hover-bg-f2" style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #E4E4E2', background: '#FFFFFF', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none', margin: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1F21" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /><path d={chevron} /></svg>
        </button>
      </div>
      <div style={{ borderTop: '1px solid #E4E4E2', padding: '16px 0 0', display: 'flex', alignItems: 'center', justifyContent: justify, gap: 10 }}>
        <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#EBEBEA', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{user?.initials}</span>
        {open && user && <div style={{ whiteSpace: 'nowrap' }}><div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div><div style={{ fontSize: 12, color: '#5F6266' }}>{user.subtitle}</div></div>}
      </div>
    </aside>
  );
}
