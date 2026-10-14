import type { ChangeEventHandler } from 'react';
import type { SegBlock } from '../model/useTripQuote';
import { MONO, linkButton } from '../styles';
import { color } from '../tokens';

interface Props { block: SegBlock; agent: string; draft: string; onDraft: ChangeEventHandler<HTMLTextAreaElement>; onCancel: () => void }

const dot = <span style={{ width: 6, height: 6, borderRadius: '50%', background: color.ink }} />;
const rule = <span style={{ flex: 1, height: 1, background: color.onDarkMuted }} />;

export function SegmentCard({ block: b, agent, draft, onDraft, onCancel }: Props) {
  return (
    <div style={{ background: color.border, borderRadius: 24, padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', padding: '14px 18px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{b.title}</span><span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{b.mode}</span></div>
        <span style={{ fontSize: '0.875rem', color: color.textSecondary }}>{b.kicker}</span>
      </div>
      {b.legs.map(l => (
        <div key={l.id} style={{ background: color.white, borderRadius: 18, padding: 'clamp(16px,2.5vw,22px) clamp(16px,2.5vw,28px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,130px),1fr))', gap: '16px 24px', alignItems: 'center' }}>
            <div><div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{l.fromCode}</div><div style={{ fontFamily: MONO, fontSize: '0.8125rem', color: color.textSecondary }}>{l.fromTime}</div></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {dot}{rule}<span style={{ background: color.chip, borderRadius: 999, padding: '3px 10px', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{l.dur}</span>{rule}{dot}
            </div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{l.toCode}</div><div style={{ fontFamily: MONO, fontSize: '0.8125rem', color: color.textSecondary }}>{l.toTime}</div></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontSize: '1rem', fontWeight: 700 }}>{l.price}</div>
              <div style={{ fontSize: '0.875rem', color: color.textSecondary }}>{l.desc}</div>
              {l.showAdd && <button onClick={l.onEdit} style={linkButton({ fontSize: '0.875rem' })}>+ Add a note</button>}
            </div>
          </div>
          {l.hasNote && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', background: color.page, borderRadius: 12, padding: '12px 16px', fontSize: '0.875rem', lineHeight: 1.5 }}>
              <span style={{ textWrap: 'pretty' }}><span style={{ color: color.textSecondary }}>Your note:</span> {l.note}</span>
              <span style={{ display: 'flex', gap: 12, flex: 'none' }}>
                <button onClick={l.onEdit} style={linkButton({ fontSize: '0.875rem' })}>Edit</button>
                <button onClick={l.onRemove} style={linkButton({ fontSize: '0.875rem', color: color.textSecondary })}>Remove</button>
              </span>
            </div>
          )}
          {l.isEditing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea placeholder={`This part is booked as planned. Ask ${agent} about timing, flexibility or special requests.`} value={draft} onChange={onDraft} style={{ minHeight: 76, border: `1px solid ${color.borderStrong}`, borderRadius: 12, padding: '10px 12px', fontSize: '0.875rem', resize: 'vertical', color: color.ink }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={l.onSave} style={{ background: color.ink, color: color.white, border: 0, borderRadius: 999, padding: '9px 18px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Save note</button>
                <button onClick={onCancel} style={{ background: color.white, color: color.ink, border: `1px solid ${color.borderStrong}`, borderRadius: 999, padding: '9px 18px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
