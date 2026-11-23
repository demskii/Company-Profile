import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { useToast } from '../components/Toast';
import ImagePickerField from '../components/admin/ImagePickerField';
import { PageLoader } from '../components/States';

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  short_description: '',
  description: '',
  specifications: '',
  image_id: null,
  image_url: '',
  is_published: true,
  is_featured: false,
  sort_order: 0,
};

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const categories = useFetch(() => api.get('/categories', { params: { status: 'all', limit: 100 } }), []);
  const product = useFetch(() => api.get(`/products/id/${id}`), [id], { enabled: editing });

  useEffect(() => {
    if (!product.data) return;
    setForm({
      name: product.data.name || '',
      slug: product.data.slug || '',
      category_id: String(product.data.category_id || ''),
      short_description: product.data.short_description || '',
      description: product.data.description || '',
      specifications: product.data.specifications || '',
      image_id: product.data.image_id || null,
      image_url: product.data.image?.url || '',
      is_published: product.data.is_published,
      is_featured: product.data.is_featured,
      sort_order: product.data.sort_order || 0,
    });
  }, [product.data]);

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Nama produk wajib diisi.' });
      return;
    }
    if (!form.category_id) {
      setErrors({ category_id: 'Pilih kategori produk.' });
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      category_id: Number(form.category_id),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      specifications: form.specifications.trim() || null,
      image_id: form.image_id || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
    };

    setSaving(true);
    try {
      if (editing) await api.put(`/products/${id}`, payload);
      else await api.post('/products', payload);
      toast(editing ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.', 'success');
      navigate('/admin/produk');
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (editing && product.loading) return <PageLoader label="Memuat produk..." />;

  if (editing && product.error) {
    return (
      <div className="empty-state">
        <h3>Produk tidak dapat dimuat</h3>
        <p>{getErrorMessage(product.error)}</p>
        <Link to="/admin/produk" className="btn btn-primary" style={{ marginTop: 16 }}>Kembali</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="admin-page-head">
        <div>
          <h2>{editing ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <p>Isi informasi produk dengan lengkap agar tampil optimal di website.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/produk" className="btn btn-outline btn-sm">
            <ArrowLeft size={15} aria-hidden="true" /> Kembali
          </Link>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </div>

      <div className="form-layout">
        <div className="form-card">
          <div className="form-section">
            <h3>Informasi Utama</h3>
            <p>Nama, kategori, dan deskripsi yang tampil pada katalog.</p>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="name">Nama Produk *</label>
                <input id="name" className="input" value={form.name} onChange={update('name')} aria-invalid={Boolean(errors.name)} />
                {errors.name ? <span className="field-error">{errors.name}</span> : null}
              </div>
              <div className="field">
                <label htmlFor="category">Kategori *</label>
                <select id="category" className="select" value={form.category_id} onChange={update('category_id')} aria-invalid={Boolean(errors.category_id)}>
                  <option value="">Pilih kategori</option>
                  {(categories.data || []).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.category_id ? <span className="field-error">{errors.category_id}</span> : null}
              </div>
              <div className="field">
                <label htmlFor="slug">Slug URL</label>
                <input id="slug" className="input" value={form.slug} onChange={update('slug')} placeholder="otomatis dari nama" />
                <span className="hint">Kosongkan untuk membuat slug otomatis.</span>
              </div>
              <div className="field full">
                <label htmlFor="short_description">Deskripsi Singkat</label>
                <textarea
                  id="short_description"
                  className="textarea"
                  style={{ minHeight: 80 }}
                  maxLength={300}
                  value={form.short_description}
                  onChange={update('short_description')}
                />
                <span className="hint">Maksimal 300 karakter, tampil pada kartu produk.</span>
              </div>
              <div className="field full">
                <label htmlFor="description">Deskripsi Lengkap</label>
                <textarea id="description" className="textarea" style={{ minHeight: 160 }} value={form.description} onChange={update('description')} />
              </div>
              <div className="field full">
                <label htmlFor="specifications">Spesifikasi</label>
                <textarea
                  id="specifications"
                  className="textarea"
                  style={{ minHeight: 140 }}
                  value={form.specifications}
                  onChange={update('specifications')}
                  placeholder={'Material: Aluminium 6063\nFinishing: Anodized\nToleransi: ±0.2 mm'}
                />
                <span className="hint">Satu spesifikasi per baris dengan format "Label: Nilai".</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="form-aside">
          <div className="form-card">
            <div className="form-section" style={{ paddingBottom: 18, marginBottom: 18 }}>
              <h3>Publikasi</h3>
              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.is_published} onChange={update('is_published')} />
                  Tampilkan di website
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.is_featured} onChange={update('is_featured')} />
                  Tandai sebagai unggulan
                </label>
                <div className="field">
                  <label htmlFor="sort_order">Urutan Tampil</label>
                  <input id="sort_order" type="number" min="0" className="input" value={form.sort_order} onChange={update('sort_order')} />
                </div>
              </div>
            </div>

            <ImagePickerField
              label="Gambar Produk"
              value={form.image_id}
              previewUrl={form.image_url}
              onChange={(media) =>
                setForm((current) => ({ ...current, image_id: media?.id || null, image_url: media?.url || '' }))
              }
              hint="JPG, PNG, atau WebP. Maksimal 5 MB."
            />
          </div>
        </aside>
      </div>
    </form>
  );
}
