import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, Target } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import StatsBand, { CTABand } from '../components/StatsBand';
import { useSettings } from '../context/SettingsContext';

export default function About() {
  const { settings, image, imageAlt } = useSettings();
  const facility = image('about_image_id');
  const missionLines = String(settings.mission || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <SEO title="Tentang Kami" />
      <PageHeader
        title="Tentang Alumindo Sejahtera"
        description="Mitra manufaktur aluminium untuk kebutuhan konstruksi, otomotif, dan industri."
        breadcrumb={[{ label: 'Tentang Kami' }]}
      />

      <section className="section">
        <div className="container intro-grid">
          <Reveal className="intro-copy">
            <span className="eyebrow">Profil Perusahaan</span>
            <h2>{settings.about_title}</h2>
            <p>{settings.about_text}</p>
            <h3 style={{ marginTop: 28, fontSize: '1.05rem' }}>Sejarah Perusahaan</h3>
            <p style={{ marginTop: 10 }}>{settings.history}</p>
            <Link to="/kontak" className="btn btn-primary" style={{ marginTop: 22 }}>
              Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal className="intro-media" delay={80}>
            {facility ? <img src={facility} alt={imageAlt('about_image_id', 'Fasilitas produksi Alumindo Sejahtera')} /> : null}
          </Reveal>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHead
            eyebrow="Visi & Misi"
            title="Arah yang kami pegang dalam bekerja"
            description="Visi dan misi menjadi dasar pengambilan keputusan di setiap lini perusahaan."
          />
          <div className="grid grid-3">
            <Reveal>
              <article className="card" style={{ padding: 30, height: '100%' }}>
                <div className="why-icon">
                  <Eye size={22} aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 10 }}>Visi</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.94rem' }}>{settings.vision}</p>
              </article>
            </Reveal>
            <Reveal delay={60}>
              <article className="card" style={{ padding: 30, height: '100%' }}>
                <div className="why-icon">
                  <Target size={22} aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 10 }}>Misi</h3>
                <ul className="check-list" style={{ marginTop: 0 }}>
                  {missionLines.map((line) => (
                    <li key={line}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="card" style={{ padding: 30, height: '100%' }}>
                <div className="why-icon">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 10 }}>Nilai Perusahaan</h3>
                <div style={{ display: 'grid', gap: 14 }}>
                  {(settings.values || []).map((value) => (
                    <div key={value.title}>
                      <strong style={{ fontSize: '0.9rem' }}>{value.title}</strong>
                      <p style={{ color: 'var(--muted)', fontSize: '0.86rem' }}>{value.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <StatsBand stats={settings.stats} />
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 96 }}>
        <div className="container">
          <CTABand
            title="Ingin mengenal kemampuan produksi kami lebih jauh?"
            text="Lihat katalog produk atau diskusikan kebutuhan proyek Anda bersama tim kami."
          >
            <Link to="/produk" className="btn btn-primary">
              Lihat Produk <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/kontak" className="btn btn-outline">
              Hubungi Kami
            </Link>
          </CTABand>
        </div>
      </section>
    </>
  );
}
