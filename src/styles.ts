import type { CSSProperties } from 'react';

export const MONO = "'IBM Plex Mono',ui-monospace,monospace";
export const SERIF = "'Instrument Serif',serif";

export const mono = (s: CSSProperties = {}): CSSProperties => ({ fontFamily: MONO, ...s });

/** Underlined text button used for inline actions ("Edit", "+ Add a note", …). */
export const linkButton = (s: CSSProperties = {}): CSSProperties => ({
  background: 'none', border: 0, padding: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1E1F21',
  textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', ...s,
});

/** Rounded status pill ("Locked price", "Priya will confirm", …). */
export const pill = (bg: string, fg: string, s: CSSProperties = {}): CSSProperties => ({
  borderRadius: 999, padding: '3px 10px', fontSize: '0.8125rem', fontWeight: 500, whiteSpace: 'nowrap', background: bg, color: fg, ...s,
});

/** Pill-shaped primary/secondary action button inside drawers. */
export const drawerButton = (s: CSSProperties = {}): CSSProperties => ({
  height: 42, padding: '0 18px', border: '1px solid #CFCFCD', borderRadius: 999, background: '#FFFFFF',
  fontSize: '0.9375rem', fontWeight: 500, color: '#1E1F21', cursor: 'pointer', whiteSpace: 'nowrap', ...s,
});
