import { PackageSearch } from 'lucide-react';

export function EmptyState({ title = 'Belum ada data', description = 'Data akan tampil di sini setelah ditambahkan.', icon: Icon = PackageSearch, action }) {
  return (
    <div className="empty-state">
      <Icon size={36} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

export function PageLoader({ label = 'Memuat data...' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
        <span className="spinner spinner--dark" aria-hidden="true" />
        <span className="muted" style={{ fontSize: '0.85rem' }}>{label}</span>
      </span>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton skeleton-card" key={index} />
      ))}
    </div>
  );
}
