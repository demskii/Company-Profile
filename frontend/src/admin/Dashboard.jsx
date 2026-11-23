import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Images,
  Mail,
  MailWarning,
  Package,
  Shapes,
  Wrench,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { formatDate } from '../utils/format';
import { MessageBadge, TableSkeleton } from '../components/admin/AdminBits';
import { EmptyState } from '../components/States';

const cards = [
  { key: 'products', label: 'Total Produk', icon: Package, tone: '' },
  { key: 'categories', label: 'Total Kategori', icon: Shapes, tone: 'stat-icon--amber' },
  { key: 'services', label: 'Total Layanan', icon: Wrench, tone: 'stat-icon--green' },
  { key: 'media', label: 'Total Gambar', icon: Images, tone: '' },
  { key: 'messages', label: 'Total Pesan', icon: Mail, tone: 'stat-icon--amber' },
  { key: 'unread', label: 'Pesan Belum Dibaca', icon: MailWarning, tone: 'stat-icon--red' },
];

export default function Dashboard() {
  const stats = useFetch(() => api.get('/dashboard/stats'), []);
  const activity = useFetch(() => api.get('/dashboard/activity', { params: { limit: 10 } }), []);

  const counts = stats.data?.counts || {};
  const maxCategory = Math.max(1, ...(stats.data?.categoryBreakdown || []).map((item) => item.total));

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Ringkasan Website</h2>
          <p>Data aktual dari database per hari ini.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/produk/baru" className="btn btn-primary btn-sm">
            <Package size={15} aria-hidden="true" /> Tambah Produk
          </Link>
          <Link to="/admin/media" className="btn btn-outline btn-sm">
            <Images size={15} aria-hidden="true" /> Media
          </Link>
        </div>
      </div>

      {stats.error ? (
        <EmptyState
          title="Statistik gagal dimuat"
          description={getErrorMessage(stats.error)}
          action={<button type="button" className="btn btn-primary" onClick={stats.reload}>Coba Lagi</button>}
        />
      ) : null}

      <div className="stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="stat-card" key={card.key}>
              <span className={`stat-icon ${card.tone}`}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <div className="stat-card-value">{stats.loading ? '-' : counts[card.key] ?? 0}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-stack">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Produk per Kategori</h3>
                <p>Distribusi katalog produk saat ini</p>
              </div>
              <Link to="/admin/kategori" className="btn btn-ghost btn-sm">
                Kelola <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="panel-body">
              {stats.loading ? (
                <TableSkeleton rows={4} />
              ) : (
                <div className="bar-list">
                  {(stats.data?.categoryBreakdown || []).map((item) => (
                    <div className="bar-row" key={item.name}>
                      <div className="bar-row-head">
                        <span>{item.name}</span>
                        <span>{item.total} produk</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${Math.max(4, (item.total / maxCategory) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                  {!stats.data?.categoryBreakdown?.length ? <p className="muted">Belum ada kategori.</p> : null}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Pesan Terbaru</h3>
                <p>Lima pesan masuk terakhir</p>
              </div>
              <Link to="/admin/pesan" className="btn btn-ghost btn-sm">
                Lihat Semua <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="data-table" style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th>Pengirim</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.data?.recentMessages || []).map((message) => (
                    <tr key={message.id}>
                      <td>
                        <strong style={{ fontSize: '0.84rem' }}>{message.name}</strong>
                        <div className="muted" style={{ fontSize: '0.74rem' }}>{message.email}</div>
                      </td>
                      <td><MessageBadge status={message.status} /></td>
                      <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(message.created_at)}</td>
                    </tr>
                  ))}
                  {!stats.loading && !stats.data?.recentMessages?.length ? (
                    <tr>
                      <td colSpan={3} className="muted">Belum ada pesan masuk.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Aktivitas Admin</h3>
              <p>Riwayat perubahan terakhir</p>
            </div>
          </div>
          <div className="panel-body">
            {activity.loading ? <TableSkeleton rows={6} /> : null}
            {!activity.loading && activity.data?.length ? (
              <div className="activity-list">
                {activity.data.map((item) => (
                  <div className="activity-item" key={item.id}>
                    <span className="activity-dot" aria-hidden="true" />
                    <div>
                      <p>{item.description}</p>
                      <time>{item.admin_name || 'Sistem'} · {formatDate(item.created_at, true)}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {!activity.loading && !activity.data?.length ? <p className="muted">Belum ada aktivitas.</p> : null}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }} className="panel">
        <div className="panel-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="stat-icon stat-icon--amber"><Boxes size={20} aria-hidden="true" /></span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <strong style={{ fontSize: '0.92rem' }}>Konten website dikelola dari database</strong>
            <p className="muted" style={{ fontSize: '0.82rem' }}>
              Perubahan pada produk, layanan, dan konten langsung tampil di halaman publik.
            </p>
          </div>
          <Link to="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
            Buka Website
          </Link>
        </div>
      </div>
    </>
  );
}
