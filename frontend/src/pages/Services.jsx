import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { CTABand } from '../components/StatsBand';
import { EmptyState, PageLoader } from '../components/States';
import { useSettings } from '../context/SettingsContext';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';

export default function Services() {
  const { settings } = useSettings();
  const services = useFetch(() => api.get('/services'), []);

  return (
    <>
      <SEO title="Layanan" description="Layanan manufaktur, fabrikasi, dan produksi komponen aluminium Alumindo Sejahtera." />
      <PageHeader
        title="Layanan Kami"
        description="Dari produksi profil hingga fabrikasi custom, kami mendukung kebutuhan aluminium Anda."
        breadcrumb={[{ label: 'Layanan' }]}
      />

      <section className="section">
        <div className="container">
          {services.loading ? <PageLoader /> : null}

          {services.error ? (
            <EmptyState
              title="Layanan gagal dimuat"
              description={getErrorMessage(services.error)}
              action={
                <button type="button" className="btn btn-primary" onClick={services.reload}>
                  Coba Lagi
                </button>
              }
            />
          ) : null}

          {!services.loading && !services.error && services.data?.length === 0 ? (
            <EmptyState title="Belum ada layanan" description="Layanan akan tampil setelah dipublikasikan melalui dashboard." />
          ) : null}

          {!services.loading && services.data?.length
            ? services.data.map((service, index) => (
                <Reveal key={service.id}>
                  <article className="service-row">
                    <div className="service-row-media">
                      {service.image?.url ? (
                        <img src={service.image.url} alt={service.image.alt || service.title} loading="lazy" />
                      ) : null}
                    </div>
                    <div>
                      <span className="service-number">LAYANAN {String(index + 1).padStart(2, '0')}</span>
                      <h2>{service.title}</h2>
                      <p>{service.description}</p>
                      <p>{service.detail}</p>
                      <ul className="check-list">
                        <li>
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <span>Konsultasi spesifikasi dan volume produksi.</span>
                        </li>
                        <li>
                          <CheckCircle2 size={16} aria-hidden="true" />
                          <span>Proses produksi mengikuti kesepakatan teknis.</span>
                        </li>
                      </ul>
                      <Link to="/kontak" className="btn btn-outline" style={{ marginTop: 22 }}>
                        Diskusikan Kebutuhan <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))
            : null}
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 96 }}>
        <div className="container">
          <CTABand
            title="Butuh layanan yang belum tercantum?"
            text="Sampaikan kebutuhan Anda. Tim kami akan membantu mencarikan solusi produksi yang sesuai."
          >
            <Link to="/kontak" className="btn btn-primary">
              Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </CTABand>
        </div>
      </section>
    </>
  );
}
