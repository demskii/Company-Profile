import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { useToast } from '../components/Toast';
import { StatusBadge, TableSkeleton } from '../components/admin/AdminBits';
import { EmptyState } from '../components/States';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ImagePickerField from '../components/admin/ImagePickerField';

const emptyForm = { title: '', description: '', detail: '', image_id: null, image_url: '', is_published: true, sort_order: 0 };

export default function AdminServices() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const services = useFetch(() => api.get('/services', { params: { status: 'all' } }), []);

  useEffect(() => {
    if (!modalOpen) setErrors({});
  }, [modalOpen]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: (services.data?.length || 0) + 1 });
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description || '',
      detail: service.detail || '',
      image_id: service.image_id || null,
      image_url: service.image?.url || '',
      is_published: service.is_published,
      sort_order: service.sort_order || 0,
    });
    setModalOpen(true);
  };

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const save = async () => {
    if (!form.title.trim()) {
      setErrors({ title: 'Judul layanan wajib diisi.' });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      detail: form.detail.trim() || null,
      image_id: form.image_id || null,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editing) await api.put(`/services/${editing.id}`, payload);
      else await api.post('/services', payload);
      toast(editing ? 'Layanan diperbarui.' : 'Layanan ditambahkan.', 'success');
      setModalOpen(false);
      services.reload();
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
      await api.delete(`/services/${deleting.id}`);
      toast('Layanan dihapus.', 'success');
      setDeleting(null);
      services.reload();
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
          <h2>Layanan Perusahaan</h2>
          <p>Kelola layanan yang tampil pada halaman Layanan dan Beranda.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
          <Plus size={15} aria-hidden="true" /> Tambah Layanan
        </button>
      </div>

      {services.loading ? <TableSkeleton rows={4} /> : null}

      {services.error ? (
        <EmptyState
          title="Layanan gagal dimuat"
          description={getErrorMessage(services.error)}
          action={<button type="button" className="btn btn-primary" onClick={services.reload}>Coba Lagi</button>}
        />
      ) : null}

      {!services.loading && !services.error && services.data?.length === 0 ? (
        <EmptyState
          title="Belum ada layanan"
          description="Tambahkan layanan pertama untuk ditampilkan di website."
          action={<button type="button" className="btn btn-primary" onClick={openCreate}>Tambah Layanan</button>}
        />
      ) : null}

      {!services.loading && services.data?.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Urutan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.data.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className="table-product">
                      {service.image?.url ? <img className="table-thumb" src={service.image.url} alt="" /> : <span className="table-thumb" aria-hidden="true" />}
                      <strong>{service.title}</strong>
                    </div>
                  </td>
                  <td className="muted" style={{ maxWidth: 360 }}>{service.description}</td>
                  <td><StatusBadge active={service.is_published} /></td>
                  <td>{service.sort_order}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="icon-btn" onClick={() => openEdit(service)} aria-label={`Edit ${service.title}`}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" className="icon-btn danger" onClick={() => setDeleting(service)} aria-label={`Hapus ${service.title}`}>
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
        title={editing ? 'Edit Layanan' : 'Tambah Layanan'}
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
            <label htmlFor="service-title">Judul Layanan *</label>
            <input id="service-title" className="input" value={form.title} onChange={update('title')} aria-invalid={Boolean(errors.title)} />
            {errors.title ? <span className="field-error">{errors.title}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="service-description">Deskripsi Singkat</label>
            <textarea id="service-description" className="textarea" style={{ minHeight: 80 }} value={form.description} onChange={update('description')} />
          </div>
          <div className="field">
            <label htmlFor="service-detail">Detail Layanan</label>
            <textarea id="service-detail" className="textarea" style={{ minHeight: 120 }} value={form.detail} onChange={update('detail')} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="service-order">Urutan</label>
              <input id="service-order" type="number" min="0" className="input" value={form.sort_order} onChange={update('sort_order')} />
            </div>
            <div className="field" style={{ alignContent: 'end' }}>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.is_published} onChange={update('is_published')} />
                Tampilkan di website
              </label>
            </div>
          </div>
          <ImagePickerField
            label="Gambar Layanan"
            value={form.image_id}
            previewUrl={form.image_url}
            onChange={(media) => setForm((current) => ({ ...current, image_id: media?.id || null, image_url: media?.url || '' }))}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus layanan?"
        message={`Layanan "${deleting?.title}" akan dihapus permanen.`}
        loading={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}
