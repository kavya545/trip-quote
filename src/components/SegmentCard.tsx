import type { ChangeEventHandler } from 'react';
import type { SegBlock } from '../model/useTripQuote';
import { MONO, linkButton } from '../styles';

interface Props { block: SegBlock; agent: string; draft: string; onDraft: ChangeEventHandler<HTMLTextAreaElement>; onCancel: () => void }

const dot = <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E1F21' }} />;
const rule = <span style={{ flex: 1, height: 1, background: '#B5B7BA' }} />;

export function SegmentCard({ block: b, agent, draft, onDraft, onCancel }: Props) {
  return (
    <div style={{ background: '#E4E4E2', borderRadius: 24, padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', padding: '14px 18px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: 15, fontWeight: 700 }}>{b.title}</span><span style={{ fontSize: 12, color: '#5F6266' }}>{b.mode}</span></div>
        <span style={{ fontSize: 12, color: '#5F6266' }}>{b.kicker}</span>
      </div>
      {b.legs.map(l => (
        <div key={l.id} style={{ background: '#FFFFFF', borderRadius: 18, padding: 'clamp(16px,2.5vw,22px) clamp(16px,2.5vw,28px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,130px),1fr))', gap: '16px 24px', alignItems: 'center' }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{l.fromCode}</div><div style={{ fontFamily: MONO, fontSize: 12, color: '#5F6266' }}>{l.fromTime}</div></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {dot}{rule}<span style={{ background: '#EBEBEA', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{l.dur}</span>{rule}{dot}
            </div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{l.toCode}</div><div style={{ fontFamily: MONO, fontSize: 12, color: '#5F6266' }}>{l.toTime}</div></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700 }}>{l.price}</div>
              <div style={{ fontSize: 13, color: '#5F6266' }}>{l.desc}</div>
              {l.showAdd && <button onClick={l.onEdit} style={linkButton({ fontSize: 13 })}>+ Add a note</button>}
            </div>
          </div>
          {l.hasNote && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', background: '#F2F2F2', borderRadius: 12, padding: '12px 16px', fontSize: 13, lineHeight: 1.5 }}>
              <span style={{ textWrap: 'pretty' }}><span style={{ color: '#5F6266' }}>Your note:</span> {l.note}</span>
              <span style={{ display: 'flex', gap: 12, flex: 'none' }}>
                <button onClick={l.onEdit} style={linkButton({ fontSize: 13 })}>Edit</button>
                <button onClick={l.onRemove} style={linkButton({ fontSize: 13, color: '#5F6266' })}>Remove</button>
              </span>
            </div>
          )}
          {l.isEditing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea placeholder={`This part is booked as planned. Ask ${agent} about timing, flexibility or special requests.`} value={draft} onChange={onDraft} style={{ minHeight: 76, border: '1px solid #CFCFCD', borderRadius: 12, padding: '10px 12px', fontSize: 14, resize: 'vertical', color: '#1E1F21' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={l.onSave} style={{ background: '#1E1F21', color: '#FFFFFF', border: 0, borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save note</button>
                <button onClick={onCancel} style={{ background: '#FFFFFF', color: '#1E1F21', border: '1px solid #CFCFCD', borderRadius: 999, padding: '9px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
