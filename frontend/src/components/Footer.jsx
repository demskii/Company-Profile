import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../context/SettingsContext';
import { whatsappLink } from '../utils/format';

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const socials = Array.isArray(settings.social) ? settings.social : [];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo light name={settings.company_name} />
            <p>{settings.footer_text || settings.tagline}</p>
            <div className="socials">
              {socials.map((item) => {
                const Icon = socialIcons[String(item.platform || '').toLowerCase()] || Linkedin;
                return (
                  <a
                    key={`${item.platform}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="footer-title">Navigasi</h3>
            <ul className="footer-links">
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/tentang">Tentang Kami</Link></li>
              <li><Link to="/produk">Produk</Link></li>
              <li><Link to="/layanan">Layanan</Link></li>
              <li><Link to="/kontak">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Produk</h3>
            <ul className="footer-links">
              <li><Link to="/produk/kategori/aluminium-konstruksi">Aluminium Konstruksi</Link></li>
              <li><Link to="/produk/kategori/komponen-otomotif">Komponen Otomotif</Link></li>
              <li><Link to="/produk/kategori/panel-aluminium-custom">Panel Aluminium Custom</Link></li>
              <li><Link to="/produk/kategori/aksesoris-aluminium">Aksesoris Aluminium</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Kontak</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={16} aria-hidden="true" />
                <span>{settings.contact_address}</span>
              </li>
              <li>
                <Phone size={16} aria-hidden="true" />
                <a href={`tel:${String(settings.contact_phone || '').replace(/[^0-9+]/g, '')}`}>
                  {settings.contact_phone}
                </a>
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </li>
            </ul>
            {settings.contact_whatsapp ? (
              <a
                className="btn btn-accent btn-sm"
                style={{ marginTop: 18 }}
                href={whatsappLink(settings.contact_whatsapp, 'Halo, saya ingin bertanya tentang produk aluminium.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {settings.company_name}. Seluruh hak cipta dilindungi.</span>
          <span>{settings.office_hours}</span>
        </div>
      </div>
    </footer>
  );
}
