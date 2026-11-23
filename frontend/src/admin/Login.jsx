import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api, getErrorMessage } from '../services/api';

export default function Login() {
  const { user, loading, login } = useAuth();
  const { settings, image } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/admin/dashboard', { replace: true });
  }, [user, loading, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.identifier.trim() || !form.password) {
      setError('Username/email dan password wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await login(form.identifier.trim(), form.password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const heroImage = image('hero_image_id');

  return (
    <div className="login-page">
      <div className="login-visual">
        <Logo light name={settings.company_name} subtitle="Admin Panel" />
        <div>
          <h1>Kelola konten website dalam satu dashboard.</h1>
          <p>
            Perbarui produk, layanan, gambar, dan informasi perusahaan tanpa mengubah source code.
          </p>
        </div>
        {heroImage ? <img src={heroImage} alt="" aria-hidden="true" /> : null}
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <Link to="/" className="login-back">
            <ArrowLeft size={14} aria-hidden="true" /> Kembali ke website
          </Link>
          <span className="eyebrow">Area Admin</span>
          <h2>Masuk ke Dashboard</h2>
          <p>Gunakan akun administrator yang sudah terdaftar.</p>

          {error ? (
            <div
              role="alert"
              style={{
                background: 'var(--danger-soft)',
                color: 'var(--danger)',
                border: '1px solid #f3caca',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: '0.84rem',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="identifier">Username atau Email</label>
              <input
                id="identifier"
                className="input"
                value={form.identifier}
                onChange={(event) => setForm({ ...form, identifier: event.target.value })}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner" aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
              {submitting ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="login-hint">
            <LockKeyhole size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} aria-hidden="true" />
            Sesi admin dilindungi cookie HttpOnly. Logout otomatis setelah 8 jam.
          </div>
        </div>
      </div>
    </div>
  );
}
