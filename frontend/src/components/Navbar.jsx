import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';

const links = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/tentang', label: 'Tentang Kami' },
  { to: '/produk', label: 'Produk' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" aria-label={`${settings.company_name} - Beranda`}>
          <Logo name={settings.company_name} subtitle={settings.tagline?.split(' untuk ')[0] || 'Manufaktur Aluminium'} />
        </Link>

        <nav className="nav-links" aria-label="Navigasi utama">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/kontak" className="btn btn-accent">
            Hubungi Kami
          </Link>
          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Navigasi seluler">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/kontak" className="btn btn-accent">
            Hubungi Kami
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
