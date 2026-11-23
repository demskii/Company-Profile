export function StatusBadge({ active, activeLabel = 'Aktif', inactiveLabel = 'Draft' }) {
  return <span className={`badge ${active ? 'badge--success' : 'badge--muted'}`}>{active ? activeLabel : inactiveLabel}</span>;
}

export function MessageBadge({ status }) {
  const map = {
    unread: { className: 'badge--warning', label: 'Belum dibaca' },
    read: { className: 'badge--info', label: 'Dibaca' },
    replied: { className: 'badge--success', label: 'Dibalas' },
  };
  const item = map[status] || map.read;
  return <span className={`badge ${item.className}`}>{item.label}</span>;
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div style={{ display: 'grid', gap: 10 }} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton" style={{ height: 56 }} />
      ))}
    </div>
  );
}
