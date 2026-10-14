export function TopBar() {
  return (
    <div style={{ minHeight: 68, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px 16px', padding: '12px clamp(16px,3vw,32px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #E4E4E2', borderRadius: 999, padding: '8px 16px', fontSize: 13, color: '#5F6266', whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden' }}>
        <span>Your trip plan from <strong style={{ color: '#1E1F21', fontWeight: 700 }}>Priya</strong></span>
        <span style={{ width: 1, height: 14, background: '#CFCFCD' }} />
        <span>Valid until <strong style={{ color: '#1E1F21', fontWeight: 700 }}>Tue 6 Oct</strong></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 'auto' }}>
        <button className="hover-underline" style={{ background: 'none', border: 0, padding: 0, fontSize: 14, fontWeight: 600, color: '#1E1F21', cursor: 'pointer' }}>Message Priya</button>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#EBEBEA', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>AR</span>Ananya
        </span>
      </div>
    </div>
  );
}
