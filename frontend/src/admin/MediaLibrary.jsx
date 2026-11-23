import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Pencil, Search, Trash2, Upload } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { useToast } from '../components/Toast';
import { EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatBytes, fileFormat } from '../utils/format';

export default function MediaLibrary() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', alt_text: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const media = useFetch(
    () => api.get('/media', { params: { page, limit: 12, search, type: 'image' } }),
    [page, search],
  );

  const uploadFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Format file harus JPG, PNG, atau WebP.', 'error');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast('Ukuran file maksimal 4 MB.', 'error');
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append('image', file);
    body.append('title', file.name.replace(/\.[^.]+$/, ''));
    try {
      await api.post('/media', body);
      toast('Gambar berhasil diunggah.', 'success');
      setPage(1);
      media.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, alt_text: item.alt_text || '' });
    setErrors({});
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/media/${editing.id}`, form);
      toast('Informasi gambar diperbarui.', 'success');
      setEditing(null);
      media.reload();
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.delete(`/media/${deleting.id}`);
      toast('Gambar dihapus.', 'success');
      setDeleting(null);
      if (media.data?.length === 1 && page > 1) setPage(page - 1);
      else media.reload();
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
          <h2>Media Library</h2>
          <p>{media.meta ? `${media.meta.total} gambar tersimpan` : 'Semua gambar website dikelola di sini.'}</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari nama gambar..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Cari gambar"
          />
        </div>
        <span className="spacer" />
        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
          <Upload size={15} aria-hidden="true" /> {uploading ? 'Mengunggah...' : 'Unggah Gambar'}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => uploadFiles(event.target.files)}
          />
        </label>
      </div>

      <label
        className={`upload-zone${dragging ? ' is-dragging' : ''}`}
        style={{ marginBottom: 20 }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          uploadFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => uploadFiles(event.target.files)}
        />
        <ImagePlus size={26} aria-hidden="true" />
        <strong>{uploading ? 'Sedang mengunggah...' : 'Tarik gambar ke sini atau klik untuk memilih'}</strong>
        <span>JPG, PNG, WebP · Maksimal 4 MB · Nama file dibuat otomatis</span>
      </label>

      {media.loading ? (
        <div className="media-grid" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton" style={{ height: 230 }} />)}
        </div>
      ) : null}

      {media.error ? (
        <EmptyState
          title="Media gagal dimuat"
          description={getErrorMessage(media.error)}
          action={<button type="button" className="btn btn-primary" onClick={media.reload}>Coba Lagi</button>}
        />
      ) : null}

      {!media.loading && !media.error && media.data?.length === 0 ? (
        <EmptyState title="Belum ada gambar" description="Unggah gambar untuk digunakan pada produk, layanan, dan konten website." icon={ImagePlus} />
      ) : null}

      {!media.loading && media.data?.length ? (
        <>
          <div className="media-grid">
            {media.data.map((item) => (
              <article className="media-card" key={item.id}>
                <div className="media-thumb">
                  <img src={item.url} alt={item.alt_text || item.title} loading="lazy" />
                </div>
                <div className="media-meta">
                  <strong title={item.title}>{item.title}</strong>
                  <span>{fileFormat(item.mime_type)} · {formatBytes(item.size_bytes)}</span>
                </div>
                <div className="media-card-actions">
                  <button type="button" className="icon-btn" onClick={() => openEdit(item)} aria-label={`Edit ${item.title}`}>
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="icon-btn danger" onClick={() => setDeleting(item)} aria-label={`Hapus ${item.title}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <Pagination page={media.meta?.page || 1} totalPages={media.meta?.totalPages || 1} onChange={setPage} />
        </>
      ) : null}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit Informasi Gambar"
        description="Nama dan alt text membantu aksesibilitas serta SEO."
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)} disabled={saving}>Batal</button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? <span className="spinner" aria-hidden="true" /> : null}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </>
        }
      >
        {editing ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <img
              src={editing.url}
              alt={editing.alt_text || editing.title}
              style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
            />
            <div className="field">
              <label htmlFor="media-title">Nama Gambar</label>
              <input
                id="media-title"
                className="input"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? <span className="field-error">{errors.title}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="media-alt">Alt Text</label>
              <input
                id="media-alt"
                className="input"
                value={form.alt_text}
                onChange={(event) => setForm({ ...form, alt_text: event.target.value })}
              />
              <span className="hint">Deskripsi singkat isi gambar untuk pembaca layar.</span>
            </div>
            <div className="muted" style={{ fontSize: '0.78rem' }}>
              {editing.original_name} · {fileFormat(editing.mime_type)} · {formatBytes(editing.size_bytes)}
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus gambar?"
        message={`Gambar "${deleting?.title}" akan dihapus dari server. Gambar yang masih dipakai produk, kategori, layanan, atau pengaturan tidak dapat dihapus.`}
        loading={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}
