import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Search, Upload } from 'lucide-react';
import Modal from '../Modal';
import { EmptyState } from '../States';
import { useToast } from '../Toast';
import { api, getErrorMessage } from '../../services/api';
import { formatBytes } from '../../utils/format';

export default function MediaPicker({ open, onClose, onSelect, currentId = null }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async (term = search) => {
    setLoading(true);
    try {
      const response = await api.get('/media', { params: { search: term, limit: 100, type: 'image' } });
      setItems(response.data.data);
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append('image', file);
    body.append('title', file.name.replace(/\.[^.]+$/, ''));
    try {
      const response = await api.post('/media', body);
      toast('Gambar berhasil diunggah.', 'success');
      setItems((current) => [response.data.data, ...current]);
      onSelect?.(response.data.data);
      onClose?.();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Pilih Gambar" description="Pilih dari media library atau unggah gambar baru." wide>
      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari gambar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') load(search);
            }}
            aria-label="Cari gambar"
          />
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => load(search)}>
          Cari
        </button>
        <span className="spacer" />
        <label className={`btn btn-primary btn-sm${uploading ? ' is-disabled' : ''}`} style={{ cursor: 'pointer' }}>
          <Upload size={15} aria-hidden="true" /> {uploading ? 'Mengunggah...' : 'Unggah Baru'}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onUpload} hidden />
        </label>
      </div>

      {loading ? <p className="muted">Memuat gambar...</p> : null}

      {!loading && items.length === 0 ? (
        <EmptyState title="Belum ada gambar" description="Unggah gambar pertama untuk digunakan di website." icon={ImagePlus} />
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="picker-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`picker-item${Number(currentId) === item.id ? ' selected' : ''}`}
              onClick={() => {
                onSelect?.(item);
                onClose?.();
              }}
              title={`${item.title} - ${formatBytes(item.size_bytes)}`}
            >
              <img src={item.url} alt={item.alt_text || item.title} loading="lazy" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
