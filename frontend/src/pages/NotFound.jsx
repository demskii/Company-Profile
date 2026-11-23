import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Halaman Tidak Ditemukan" />
      <section className="section" style={{ minHeight: '55vh', display: 'grid', placeItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>404</div>
          <h1 style={{ fontSize: '1.6rem', margin: '14px 0 10px' }}>Halaman tidak ditemukan</h1>
          <p className="muted" style={{ marginBottom: 24 }}>
            Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Beranda
          </Link>
        </div>
      </section>
    </>
  );
}
