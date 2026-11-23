import { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../components/Toast';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { whatsappLink } from '../utils/format';

const initialForm = { name: '', email: '', phone: '', message: '', website: '' };

function validateForm(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Email tidak valid.';
  if (!/^[0-9+()\s.-]{6,40}$/.test(form.phone.trim())) errors.phone = 'Nomor telepon tidak valid.';
  if (form.message.trim().length < 10) errors.message = 'Pesan minimal 10 karakter.';
  return errors;
}

export default function Contact() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/contact', form);
      toast(response.data.data.message, 'success');
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Kontak" description="Hubungi Alumindo Sejahtera untuk informasi produk dan penawaran aluminium." />
      <PageHeader
        title="Hubungi Kami"
        description="Sampaikan kebutuhan Anda. Tim kami akan merespons pada jam kerja."
        breadcrumb={[{ label: 'Kontak' }]}
      />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Informasi Kontak</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', marginBottom: 12 }}>
              Mari diskusikan kebutuhan aluminium Anda
            </h2>
            <p className="muted">
              Untuk penawaran produk, fabrikasi custom, atau kerja sama produksi, hubungi kami melalui kanal berikut.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-card-icon"><MapPin size={19} aria-hidden="true" /></div>
                <div>
                  <h3>Alamat</h3>
                  <p>{settings.contact_address}</p>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><Phone size={19} aria-hidden="true" /></div>
                <div>
                  <h3>Telepon</h3>
                  <a href={`tel:${String(settings.contact_phone || '').replace(/[^0-9+]/g, '')}`}>{settings.contact_phone}</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><Mail size={19} aria-hidden="true" /></div>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon"><Clock size={19} aria-hidden="true" /></div>
                <div>
                  <h3>Jam Operasional</h3>
                  <p>{settings.office_hours}</p>
                </div>
              </div>
            </div>

            {settings.contact_whatsapp ? (
              <a
                className="btn btn-accent"
                href={whatsappLink(settings.contact_whatsapp, 'Halo, saya ingin bertanya tentang produk aluminium.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} aria-hidden="true" /> Chat WhatsApp
              </a>
            ) : null}
          </div>

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <h2>Kirim Pesan</h2>
            <p>Isi formulir berikut. Kolom bertanda * wajib diisi.</p>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Nama *</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  required
                />
                {errors.name ? <span className="field-error">{errors.name}</span> : null}
              </div>
              <div className="field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  required
                />
                {errors.email ? <span className="field-error">{errors.email}</span> : null}
              </div>
              <div className="field full">
                <label htmlFor="phone">Nomor Telepon *</label>
                <input
                  id="phone"
                  className="input"
                  value={form.phone}
                  onChange={update('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  autoComplete="tel"
                  placeholder="08xx xxxx xxxx"
                  required
                />
                {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
              </div>
              <div className="field full">
                <label htmlFor="message">Pesan *</label>
                <textarea
                  id="message"
                  className="textarea"
                  value={form.message}
                  onChange={update('message')}
                  aria-invalid={Boolean(errors.message)}
                  placeholder="Jelaskan kebutuhan produk, volume, dan tenggat proyek Anda."
                  required
                />
                {errors.message ? <span className="field-error">{errors.message}</span> : null}
              </div>
              <div className="field full" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update('website')}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 22 }} disabled={loading}>
              {loading ? <span className="spinner" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
              {loading ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </section>

      {settings.contact_maps ? (
        <section className="section--tight" style={{ paddingBottom: 96 }}>
          <div className="container">
            <div className="map-frame">
              <iframe
                src={settings.contact_maps}
                title="Lokasi Alumindo Sejahtera"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
