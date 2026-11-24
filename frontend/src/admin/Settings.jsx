import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { useToast } from '../components/Toast';
import { useSettings } from '../context/SettingsContext';
import ImagePickerField from '../components/admin/ImagePickerField';
import { PageLoader } from '../components/States';

export default function SettingsPage() {
  const { toast } = useToast();
  const { refresh } = useSettings();
  const fetch = useFetch(() => api.get('/settings/all'), []);
  const [form, setForm] = useState(null);
  const [previews, setPreviews] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!fetch.data) return;
    setForm(fetch.data.settings);
    setPreviews({
      logo_id: fetch.data.media.logo_id?.url || '',
      favicon_id: fetch.data.media.favicon_id?.url || '',
    });
  }, [fetch.data]);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const setImage = (key) => (media) => {
    setForm((current) => ({ ...current, [key]: media?.id ? String(media.id) : '' }));
    setPreviews((current) => ({ ...current, [key]: media?.url || '' }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings', { settings: form });
      await refresh();
      toast('Pengaturan website disimpan.', 'success');
      fetch.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (fetch.loading || !form) return <PageLoader label="Memuat pengaturan..." />;
  if (fetch.error) {
    return (
      <div className="empty-state">
        <h3>Pengaturan gagal dimuat</h3>
        <p>{getErrorMessage(fetch.error)}</p>
        <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={fetch.reload}>Coba Lagi</button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Pengaturan Website</h2>
          <p>Identitas perusahaan, logo, favicon, dan SEO dasar.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
          {saving ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>

      <div className="form-layout">
        <div className="form-card">
          <div className="form-section">
            <h3>Identitas Perusahaan</h3>
            <p>Nama dan tagline tampil pada header serta footer website.</p>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="company_name">Nama Perusahaan</label>
                <input id="company_name" className="input" value={form.company_name || ''} onChange={set('company_name')} />
              </div>
              <div className="field full">
                <label htmlFor="tagline">Tagline</label>
                <input id="tagline" className="input" value={form.tagline || ''} onChange={set('tagline')} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>SEO Dasar</h3>
            <p>Digunakan sebagai judul dan deskripsi default halaman.</p>
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="field">
                <label htmlFor="seo_title">SEO Title</label>
                <input id="seo_title" className="input" value={form.seo_title || ''} onChange={set('seo_title')} />
              </div>
              <div className="field">
                <label htmlFor="meta_description">Meta Description</label>
                <textarea id="meta_description" className="textarea" style={{ minHeight: 90 }} maxLength={320} value={form.meta_description || ''} onChange={set('meta_description')} />
                <span className="hint">Idealnya 120-160 karakter.</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Footer</h3>
            <div className="field">
              <label htmlFor="footer_text">Deskripsi Singkat Footer</label>
              <textarea id="footer_text" className="textarea" style={{ minHeight: 80 }} value={form.footer_text || ''} onChange={set('footer_text')} />
            </div>
          </div>
        </div>

        <aside className="form-aside">
          <div className="form-card">
            <ImagePickerField
              label="Logo Perusahaan"
              value={form.logo_id}
              previewUrl={previews.logo_id}
              onChange={setImage('logo_id')}
              hint="Tampil di header, footer, dan dashboard bersama nama perusahaan. Gunakan PNG transparan, minimal 256px."
            />
            <div style={{ height: 20 }} />
            <ImagePickerField
              label="Favicon"
              value={form.favicon_id}
              previewUrl={previews.favicon_id}
              onChange={setImage('favicon_id')}
              hint="Ikon tab browser. Gunakan gambar persegi minimal 64x64 px."
            />
          </div>
        </aside>
      </div>
    </>
  );
}
