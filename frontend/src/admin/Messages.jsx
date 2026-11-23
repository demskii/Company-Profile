import { useEffect, useState } from 'react';
import { Eye, Search, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { useToast } from '../components/Toast';
import { MessageBadge, TableSkeleton } from '../components/admin/AdminBits';
import { EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/format';

export default function Messages() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const messages = useFetch(
    () => api.get('/contact', { params: { page, limit: 10, search, status } }),
    [page, search, status],
  );

  const openDetail = async (message) => {
    setDetailLoading(true);
    setSelected(message);
    try {
      const response = await api.get(`/contact/${message.id}`);
      setSelected(response.data.data);
      messages.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (nextStatus) => {
    if (!selected) return;
    try {
      const response = await api.put(`/contact/${selected.id}`, { status: nextStatus });
      setSelected(response.data.data);
      toast('Status pesan diperbarui.', 'success');
      messages.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.delete(`/contact/${deleting.id}`);
      toast('Pesan dihapus.', 'success');
      setDeleting(null);
      if (selected?.id === deleting.id) setSelected(null);
      if (messages.data?.length === 1 && page > 1) setPage(page - 1);
      else messages.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Pesan Masuk</h2>
          <p>{messages.meta ? `${messages.meta.total} pesan dari formulir kontak` : 'Pesan dari pengunjung website.'}</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari nama, email, atau pesan..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Cari pesan"
          />
        </div>
        <select
          className="select"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter status pesan"
        >
          <option value="">Semua status</option>
          <option value="unread">Belum dibaca</option>
          <option value="read">Dibaca</option>
          <option value="replied">Dibalas</option>
        </select>
      </div>

      {messages.loading ? <TableSkeleton rows={5} /> : null}

      {messages.error ? (
        <EmptyState
          title="Pesan gagal dimuat"
          description={getErrorMessage(messages.error)}
          action={<button type="button" className="btn btn-primary" onClick={messages.reload}>Coba Lagi</button>}
        />
      ) : null}

      {!messages.loading && !messages.error && messages.data?.length === 0 ? (
        <EmptyState title="Belum ada pesan" description="Pesan yang dikirim melalui formulir kontak akan tampil di sini." />
      ) : null}

      {!messages.loading && messages.data?.length ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengirim</th>
                  <th>Kontak</th>
                  <th>Pesan</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {messages.data.map((message) => (
                  <tr key={message.id}>
                    <td><strong style={{ fontSize: '0.86rem' }}>{message.name}</strong></td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{message.email}</div>
                      <div className="muted" style={{ fontSize: '0.76rem' }}>{message.phone}</div>
                    </td>
                    <td className="muted" style={{ maxWidth: 300 }}>
                      {message.message.length > 90 ? `${message.message.slice(0, 90)}...` : message.message}
                    </td>
                    <td><MessageBadge status={message.status} /></td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(message.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="icon-btn" onClick={() => openDetail(message)} aria-label={`Lihat pesan dari ${message.name}`}>
                          <Eye size={15} />
                        </button>
                        <button type="button" className="icon-btn danger" onClick={() => setDeleting(message)} aria-label={`Hapus pesan dari ${message.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={messages.meta?.page || 1} totalPages={messages.meta?.totalPages || 1} onChange={setPage} />
        </>
      ) : null}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detail Pesan"
        description={detailLoading ? 'Memuat detail...' : 'Pesan dari formulir kontak website.'}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => updateStatus('read')}>Tandai Dibaca</button>
            <button type="button" className="btn btn-primary" onClick={() => updateStatus('replied')}>Tandai Dibalas</button>
          </>
        }
      >
        {selected ? (
          <>
            <div className="message-meta">
              <div><span>Nama</span>{selected.name}</div>
              <div><span>Email</span><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
              <div><span>Telepon</span><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
              <div><span>Tanggal</span>{formatDate(selected.created_at, true)}</div>
              <div><span>Status</span><MessageBadge status={selected.status} /></div>
            </div>
            <p className="message-body">{selected.message}</p>
          </>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus pesan?"
        message={`Pesan dari "${deleting?.name}" akan dihapus permanen.`}
        loading={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}
