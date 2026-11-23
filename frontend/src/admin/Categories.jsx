import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { useToast } from '../components/Toast';
import { StatusBadge, TableSkeleton } from '../components/admin/AdminBits';
import { EmptyState } from '../components/States';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImagePickerField from '../components/admin/ImagePickerField';

const emptyForm = { name: '', slug: '', description: '', image_id: null, image_url: '', is_active: true, sort_order: 0 };

export default function AdminCategories() {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const categories = useFetch(
    () => api.get('/categories', { params: { status: 'all', search, limit: 100 } }),
    [search],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_id: category.image_id || null,
      image_url: category.image?.url || '',
      is_active: category.is_active,
      sort_order: category.sort_order || 0,
    });
    setErrors({});
    setModalOpen(true);
  };

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const save = async () => {
    if (!form.name.trim()) {
      setErrors({ name: 'Nama kategori wajib diisi.' });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || null,
      image_id: form.image_id || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editing) await api.put(`/categories/${editing.id}`, payload);
      else await api.post('/categories', payload);
      toast(editing ? 'Kategori diperbarui.' : 'Kategori ditambahkan.', 'success');
      setModalOpen(false);
      categories.reload();
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
      await api.delete(`/categories/${deleting.id}`);
      toast('Kategori dihapus.', 'success');
      setDeleting(null);
      categories.reload();
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
          <h2>Kategori Produk</h2>
          <p>{categories.meta ? `${categories.meta.total} kategori terdaftar` : 'Kelompokkan produk berdasarkan kategori.'}</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={15} aria-hidden="true" /> Tambah Kategori
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari kategori..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Cari kategori"
          />
        </div>
      </div>

      {categories.loading ? <TableSkeleton rows={4} /> : null}

      {categories.error ? (
        <EmptyState
          title="Kategori gagal dimuat"
          description={getErrorMessage(categories.error)}
          action={<button type="button" className="btn btn-primary" onClick={categories.reload}>Coba Lagi</button>}
        />
      ) : null}

      {!categories.loading && !categories.error && categories.data?.length === 0 ? (
        <EmptyState
          title="Belum ada kategori"
          description="Tambahkan kategori untuk mengelompokkan produk."
          action={<button type="button" className="btn btn-primary" onClick={openCreate}>Tambah Kategori</button>}
        />
      ) : null}

      {!categories.loading && categories.data?.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Jumlah Produk</th>
                <th>Status</th>
                <th>Urutan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.data.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div className="table-product">
                      {category.image?.url ? <img className="table-thumb" src={category.image.url} alt="" /> : <span className="table-thumb" aria-hidden="true" />}
                      <div>
                        <strong>{category.name}</strong>
                        <span>/{category.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {category.product_count > 0 ? (
                      <Link to={`/admin/produk?kategori=${category.slug}`} className="link-arrow" style={{ fontSize: '0.82rem' }}>
                        {category.product_count} produk
                      </Link>
                    ) : (
                      <span className="muted">0 produk</span>
                    )}
                  </td>
                  <td><StatusBadge active={category.is_active} /></td>
                  <td>{category.sort_order}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => openEdit(category)} aria-label={`Edit ${category.name}`}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" className="icon-btn danger" onClick={() => setDeleting(category)} aria-label={`Hapus ${category.name}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Kategori' : 'Tambah Kategori'}
        description="Kategori yang nonaktif tidak tampil di website."
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)} disabled={saving}>Batal</button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? <span className="spinner" aria-hidden="true" /> : null}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="field">
            <label htmlFor="category-name">Nama Kategori *</label>
            <input id="category-name" className="input" value={form.name} onChange={update('name')} aria-invalid={Boolean(errors.name)} />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="category-slug">Slug URL</label>
              <input id="category-slug" className="input" value={form.slug} onChange={update('slug')} placeholder="otomatis" />
            </div>
            <div className="field">
              <label htmlFor="category-order">Urutan</label>
              <input id="category-order" type="number" min="0" className="input" value={form.sort_order} onChange={update('sort_order')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="category-description">Deskripsi</label>
            <textarea id="category-description" className="textarea" style={{ minHeight: 90 }} value={form.description} onChange={update('description')} />
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={form.is_active} onChange={update('is_active')} />
            Kategori aktif dan tampil di website
          </label>
          <ImagePickerField
            label="Gambar Kategori"
            value={form.image_id}
            previewUrl={form.image_url}
            onChange={(media) => setForm((current) => ({ ...current, image_id: media?.id || null, image_url: media?.url || '' }))}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus kategori?"
        message={
          deleting?.product_count > 0
            ? `Kategori "${deleting?.name}" masih memiliki ${deleting.product_count} produk. Kategori tidak dapat dihapus sebelum produk dipindahkan atau dihapus.`
            : `Kategori "${deleting?.name}" akan dihapus permanen.`
        }
        loading={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}
