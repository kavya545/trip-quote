import { color } from '../tokens';
interface Props { agent: string; validUntil: string; daysLeft: number; user: { name: string; initials: string } }

const daysLeftLabel = (n: number) => n > 1 ? `${n} days left` : n === 1 ? '1 day left' : n === 0 ? 'Last day to respond' : `Expired ${-n} day${n === -1 ? '' : 's'} ago`;

export function TopBar({ agent, validUntil, daysLeft, user }: Props) {
  return (
    <div style={{ minHeight: 68, background: color.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px 16px', padding: '12px clamp(16px,3vw,32px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${color.border}`, borderRadius: 999, padding: '8px 16px', fontSize: '0.875rem', color: color.textSecondary, whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden' }}>
        <span>Your trip plan from <strong style={{ color: color.ink, fontWeight: 700 }}>{agent}</strong></span>
        <span style={{ width: 1, height: 14, background: color.borderStrong }} />
        <span title={daysLeftLabel(daysLeft)}>Valid until <strong style={{ color: color.ink, fontWeight: 700 }}>{validUntil}</strong></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 'auto' }}>
        <button className="hover-underline" style={{ background: 'none', border: 0, padding: 0, fontSize: '0.875rem', fontWeight: 600, color: color.ink, cursor: 'pointer' }}>{`Message ${agent}`}</button>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: color.chip, display: 'grid', placeItems: 'center', fontSize: '0.8125rem', fontWeight: 700 }}>{user.initials}</span>{user.name}
        </span>
      </div>
    </div>
  );
}
