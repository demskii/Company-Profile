import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { useToast } from '../components/Toast';
import { useSettings } from '../context/SettingsContext';
import ImagePickerField from '../components/admin/ImagePickerField';
import { PageLoader } from '../components/States';

function ListEditor({ items = [], fields, onChange, addLabel, emptyItem }) {
  const updateItem = (index, key, value) => {
    const next = items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item));
    onChange(next);
  };

  return (
    <div className="list-editor">
      {items.map((item, index) => (
        <div
          className="list-editor-row"
          style={{ gridTemplateColumns: `repeat(${fields.length}, minmax(0, 1fr)) auto` }}
          key={index}
        >
          {fields.map((field) => (
            <input
              key={field.key}
              className="input"
              placeholder={field.placeholder || field.label}
              value={item[field.key] ?? ''}
              onChange={(event) => updateItem(index, field.key, event.target.value)}
              aria-label={`${field.label} ${index + 1}`}
            />
          ))}
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            aria-label={`Hapus baris ${index + 1}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...items, { ...emptyItem }])}>
          <Plus size={14} aria-hidden="true" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

const tabs = [
  { key: 'hero', label: 'Hero Beranda' },
  { key: 'about', label: 'Tentang Kami' },
  { key: 'why', label: 'Keunggulan & CTA' },
  { key: 'stats', label: 'Statistik' },
  { key: 'contact', label: 'Kontak & Footer' },
];

export default function ContentManager() {
  const { toast } = useToast();
  const { refresh } = useSettings();
  const fetch = useFetch(() => api.get('/settings/all'), []);
  const [form, setForm] = useState(null);
  const [previews, setPreviews] = useState({});
  const [tab, setTab] = useState('hero');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!fetch.data) return;
    setForm(fetch.data.settings);
    setPreviews({
      hero_image_id: fetch.data.media.hero_image_id?.url || '',
      about_image_id: fetch.data.media.about_image_id?.url || '',
    });
  }, [fetch.data]);

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const setImage = (key) => (media) => {
    setForm((current) => ({ ...current, [key]: media?.id ? String(media.id) : '' }));
    setPreviews((current) => ({ ...current, [key]: media?.url || '' }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings', { settings: form });
      await refresh();
      toast('Konten website berhasil disimpan.', 'success');
      fetch.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (fetch.loading || !form) return <PageLoader label="Memuat konten website..." />;

  if (fetch.error) {
    return (
      <div className="empty-state">
        <h3>Konten gagal dimuat</h3>
        <p>{getErrorMessage(fetch.error)}</p>
        <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={fetch.reload}>Coba Lagi</button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Konten Website</h2>
          <p>Perubahan langsung tampil di halaman publik setelah disimpan.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
          {saving ? <span className="spinner" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="tabs" role="tablist" aria-label="Bagian konten">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`tab${tab === item.key ? ' active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="form-card">
        {tab === 'hero' ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field">
              <label htmlFor="hero_title">Judul Hero</label>
              <input id="hero_title" className="input" value={form.hero_title || ''} onChange={set('hero_title')} />
            </div>
            <div className="field">
              <label htmlFor="hero_subtitle">Deskripsi Hero</label>
              <textarea id="hero_subtitle" className="textarea" value={form.hero_subtitle || ''} onChange={set('hero_subtitle')} />
            </div>
            <div style={{ maxWidth: 360 }}>
              <ImagePickerField
                label="Gambar Hero"
                value={form.hero_image_id}
                previewUrl={previews.hero_image_id}
                onChange={setImage('hero_image_id')}
                hint="Gunakan gambar landscape beresolusi tinggi."
              />
            </div>
          </div>
        ) : null}

        {tab === 'about' ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field">
              <label htmlFor="about_title">Judul Profil Singkat</label>
              <input id="about_title" className="input" value={form.about_title || ''} onChange={set('about_title')} />
            </div>
            <div className="field">
              <label htmlFor="about_text">Profil Singkat</label>
              <textarea id="about_text" className="textarea" value={form.about_text || ''} onChange={set('about_text')} />
            </div>
            <div className="field">
              <label htmlFor="history">Sejarah Perusahaan</label>
              <textarea id="history" className="textarea" style={{ minHeight: 150 }} value={form.history || ''} onChange={set('history')} />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="vision">Visi</label>
                <textarea id="vision" className="textarea" value={form.vision || ''} onChange={set('vision')} />
              </div>
              <div className="field">
                <label htmlFor="mission">Misi</label>
                <textarea id="mission" className="textarea" value={form.mission || ''} onChange={set('mission')} />
                <span className="hint">Satu poin misi per baris.</span>
              </div>
            </div>
            <div className="field">
              <label>Nilai Perusahaan</label>
              <ListEditor
                items={form.values || []}
                fields={[
                  { key: 'title', label: 'Nilai' },
                  { key: 'description', label: 'Deskripsi' },
                ]}
                emptyItem={{ title: '', description: '' }}
                addLabel="Tambah Nilai"
                onChange={(items) => setForm((current) => ({ ...current, values: items }))}
              />
            </div>
            <div style={{ maxWidth: 360 }}>
              <ImagePickerField
                label="Foto Perusahaan"
                value={form.about_image_id}
                previewUrl={previews.about_image_id}
                onChange={setImage('about_image_id')}
              />
            </div>
          </div>
        ) : null}

        {tab === 'why' ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field">
              <label>Keunggulan Perusahaan</label>
              <ListEditor
                items={form.why_items || []}
                fields={[
                  { key: 'title', label: 'Judul' },
                  { key: 'description', label: 'Deskripsi' },
                ]}
                emptyItem={{ title: '', description: '' }}
                addLabel="Tambah Keunggulan"
                onChange={(items) => setForm((current) => ({ ...current, why_items: items }))}
              />
            </div>
            <div className="field">
              <label htmlFor="cta_title">Judul CTA</label>
              <input id="cta_title" className="input" value={form.cta_title || ''} onChange={set('cta_title')} />
            </div>
            <div className="field">
              <label htmlFor="cta_text">Deskripsi CTA</label>
              <textarea id="cta_text" className="textarea" value={form.cta_text || ''} onChange={set('cta_text')} />
            </div>
          </div>
        ) : null}

        {tab === 'stats' ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>Statistik Perusahaan</h3>
              <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 14 }}>
                Gunakan data aktual perusahaan. Angka contoh dari seed harus diganti dengan data resmi.
              </p>
              <ListEditor
                items={form.stats || []}
                fields={[
                  { key: 'label', label: 'Label' },
                  { key: 'value', label: 'Nilai' },
                  { key: 'suffix', label: 'Satuan' },
                ]}
                emptyItem={{ label: '', value: '', suffix: '' }}
                addLabel="Tambah Statistik"
                onChange={(items) => setForm((current) => ({ ...current, stats: items }))}
              />
            </div>
          </div>
        ) : null}

        {tab === 'contact' ? (
          <div style={{ display: 'grid', gap: 18 }}>
            <div className="field">
              <label htmlFor="contact_address">Alamat</label>
              <textarea id="contact_address" className="textarea" style={{ minHeight: 80 }} value={form.contact_address || ''} onChange={set('contact_address')} />
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="contact_phone">Nomor Telepon</label>
                <input id="contact_phone" className="input" value={form.contact_phone || ''} onChange={set('contact_phone')} />
              </div>
              <div className="field">
                <label htmlFor="contact_whatsapp">Nomor WhatsApp</label>
                <input id="contact_whatsapp" className="input" value={form.contact_whatsapp || ''} onChange={set('contact_whatsapp')} placeholder="628xxxxxxxxxx" />
                <span className="hint">Format internasional tanpa tanda +.</span>
              </div>
              <div className="field">
                <label htmlFor="contact_email">Email</label>
                <input id="contact_email" type="email" className="input" value={form.contact_email || ''} onChange={set('contact_email')} />
              </div>
              <div className="field">
                <label htmlFor="office_hours">Jam Operasional</label>
                <input id="office_hours" className="input" value={form.office_hours || ''} onChange={set('office_hours')} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="contact_maps">URL Google Maps Embed</label>
              <input id="contact_maps" className="input" value={form.contact_maps || ''} onChange={set('contact_maps')} />
              <span className="hint">Gunakan URL dengan akhiran output=embed dari Google Maps.</span>
            </div>
            <div className="field">
              <label>Social Media</label>
              <ListEditor
                items={form.social || []}
                fields={[
                  { key: 'platform', label: 'Platform' },
                  { key: 'url', label: 'URL' },
                ]}
                emptyItem={{ platform: '', url: '' }}
                addLabel="Tambah Social Media"
                onChange={(items) => setForm((current) => ({ ...current, social: items }))}
              />
            </div>
            <div className="field">
              <label htmlFor="footer_text">Deskripsi Footer</label>
              <textarea id="footer_text" className="textarea" value={form.footer_text || ''} onChange={set('footer_text')} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
