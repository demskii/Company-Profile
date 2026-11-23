import { useEffect, useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api, getErrorMessage, getFieldErrors } from '../services/api';
import { formatDate } from '../utils/format';

export default function Account() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', username: '', email: '', current_password: '', new_password: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
    }));
  }, [user]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      await refresh();
      setForm((current) => ({ ...current, current_password: '', new_password: '' }));
      toast('Profil akun berhasil diperbarui.', 'success');
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Akun Saya</h2>
          <p>Kelola profil dan keamanan akun administrator.</p>
        </div>
      </div>

      <div className="form-layout">
        <form className="form-card" onSubmit={save}>
          <div className="form-section">
            <h3>Informasi Akun</h3>
            <p>Username dan email digunakan untuk login.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="account-name">Nama Lengkap</label>
                <input id="account-name" className="input" value={form.name} onChange={update('name')} aria-invalid={Boolean(errors.name)} />
                {errors.name ? <span className="field-error">{errors.name}</span> : null}
              </div>
              <div className="field">
                <label htmlFor="account-username">Username</label>
                <input id="account-username" className="input" value={form.username} onChange={update('username')} aria-invalid={Boolean(errors.username)} />
                {errors.username ? <span className="field-error">{errors.username}</span> : null}
              </div>
              <div className="field full">
                <label htmlFor="account-email">Email</label>
                <input id="account-email" type="email" className="input" value={form.email} onChange={update('email')} aria-invalid={Boolean(errors.email)} />
                {errors.email ? <span className="field-error">{errors.email}</span> : null}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Ubah Password</h3>
            <p>Kosongkan kolom password jika tidak ingin mengubahnya.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="current-password">Password Saat Ini</label>
                <input id="current-password" type="password" className="input" value={form.current_password} onChange={update('current_password')} autoComplete="current-password" />
              </div>
              <div className="field">
                <label htmlFor="new-password">Password Baru</label>
                <input id="new-password" type="password" className="input" value={form.new_password} onChange={update('new_password')} autoComplete="new-password" aria-invalid={Boolean(errors.new_password)} />
                {errors.new_password ? <span className="field-error">{errors.new_password}</span> : null}
                <span className="hint">Minimal 8 karakter.</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>

        <aside className="form-aside">
          <div className="form-card">
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span className="admin-avatar" style={{ width: 52, height: 52, fontSize: '1.1rem' }}>
                {(user?.name || 'A').slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong style={{ display: 'block' }}>{user?.name}</strong>
                <span className="muted" style={{ fontSize: '0.8rem' }}>@{user?.username}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 20, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span className="muted">Email</span>
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span className="muted">Login terakhir</span>
                <span>{formatDate(user?.last_login_at, true)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span className="muted">Akun dibuat</span>
                <span>{formatDate(user?.created_at)}</span>
              </div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.78rem', color: 'var(--muted)' }}>
              <ShieldCheck size={16} style={{ flex: 'none', color: 'var(--success)' }} aria-hidden="true" />
              Password disimpan dalam bentuk hash bcrypt dan tidak pernah ditampilkan kembali.
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
