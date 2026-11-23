import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  Shapes,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

const navGroups = [
  {
    label: 'Utama',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Konten',
    items: [
      { to: '/admin/produk', label: 'Produk', icon: Package },
      { to: '/admin/kategori', label: 'Kategori', icon: Shapes },
      { to: '/admin/layanan', label: 'Layanan', icon: Wrench },
      { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
      { to: '/admin/konten', label: 'Konten Website', icon: FileText },
    ],
  },
  {
    label: 'Interaksi',
    items: [{ to: '/admin/pesan', label: 'Pesan Masuk', icon: Mail, badgeKey: 'unread' }],
  },
  {
    label: 'Sistem',
    items: [
      { to: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
      { to: '/admin/akun', label: 'Akun Saya', icon: UserRound },
    ],
  },
];

const titles = {
  '/admin/dashboard': ['Dashboard', 'Ringkasan konten dan aktivitas website'],
  '/admin/produk': ['Produk', 'Kelola katalog produk aluminium'],
  '/admin/produk/baru': ['Tambah Produk', 'Buat produk baru'],
  '/admin/kategori': ['Kategori', 'Kelola kategori produk'],
  '/admin/layanan': ['Layanan', 'Kelola layanan perusahaan'],
  '/admin/media': ['Media Library', 'Kelola seluruh gambar website'],
  '/admin/konten': ['Konten Website', 'Kelola konten halaman publik'],
  '/admin/pesan': ['Pesan Masuk', 'Pesan dari formulir kontak'],
  '/admin/pengaturan': ['Pengaturan Website', 'Identitas dan SEO website'],
  '/admin/akun': ['Akun Saya', 'Profil dan keamanan akun admin'],
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    api
      .get('/dashboard/stats')
      .then((response) => {
        if (active) setUnread(response.data.data.counts.unread || 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const title = location.pathname.endsWith('/edit')
    ? ['Edit Produk', 'Perbarui data produk']
    : titles[location.pathname] || ['Dashboard', ''];

  const handleLogout = async () => {
    await logout();
    toast('Anda sudah logout.', 'info');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      {open ? <button type="button" className="admin-overlay" aria-label="Tutup menu" onClick={() => setOpen(false)} /> : null}

      <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link to="/admin/dashboard" aria-label="Dashboard">
            <Logo light name={settings.company_name} subtitle="Admin Panel" />
          </Link>
        </div>

        <nav className="admin-nav" aria-label="Navigasi admin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="admin-nav-group">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin/produk'}
                    className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badgeKey === 'unread' && unread > 0 ? <span className="admin-nav-badge">{unread}</span> : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <div style={{ marginBottom: 10 }}>{settings.company_name}</div>
          <button type="button" className="admin-nav-link" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 0 }}>
            <LogOut size={17} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="icon-btn admin-menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Buka menu admin"
            >
              <Menu size={19} />
            </button>
            <div>
              <h1>{title[0]}</h1>
              <p>{title[1]}</p>
            </div>
          </div>
          <div className="admin-topbar-right">
            <Link to="/" className="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
              Lihat Website
            </Link>
            <div className="admin-user">
              <span className="admin-avatar" aria-hidden="true">
                {(user?.name || 'A').slice(0, 1).toUpperCase()}
              </span>
              <div>
                <strong>{user?.name}</strong>
                <span>@{user?.username}</span>
              </div>
            </div>
            <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Logout">
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
