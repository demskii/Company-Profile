import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Factory } from "lucide-react";
import SEO from "../components/SEO";
import Reveal from "../components/Reveal";
import SectionHead from "../components/SectionHead";
import ProductCard from "../components/ProductCard";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsBand, { CTABand } from "../components/StatsBand";
import { SkeletonGrid } from "../components/States";
import { useSettings } from "../context/SettingsContext";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";

const points = [
  "Proses produksi terkontrol dari pemilihan material hingga finishing.",
  "Spesifikasi disesuaikan dengan gambar kerja dan kebutuhan proyek.",
  "Dukungan teknis yang jelas dari penawaran hingga pengiriman.",
];

export default function Home() {
  const { settings, image, imageAlt } = useSettings();
  const heroImage = image("hero_image_id");
  const aboutImage = image("about_image_id");

  const products = useFetch(
    () => api.get("/products", { params: { featured: 1, limit: 4 } }),
    []
  );
  const services = useFetch(() => api.get("/services"), []);

  return (
    <>
      <SEO />

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Manufaktur Aluminium</span>
            <h1>{settings.hero_title}</h1>
            <p>{settings.hero_subtitle}</p>
            <div className="hero-actions">
              <Link to="/produk" className="btn btn-accent">
                Lihat Produk <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/kontak" className="btn btn-on-dark">
                Hubungi Kami
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            {heroImage ? (
              <img
                src={heroImage}
                alt={imageAlt(
                  "hero_image_id",
                  "Fasilitas manufaktur aluminium"
                )}
              />
            ) : (
              <div
                style={{
                  aspectRatio: "4 / 3.4",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid rgba(255,255,255,.18)",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.02))",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Factory
                  size={64}
                  style={{ opacity: 0.5 }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container intro-grid">
          <Reveal className="intro-media">
            {aboutImage ? (
              <img
                src={aboutImage}
                alt={imageAlt("about_image_id", "Fasilitas produksi")}
              />
            ) : null}
          </Reveal>
          <Reveal className="intro-copy" delay={80}>
            <span className="eyebrow">Tentang Perusahaan</span>
            <h2>{settings.about_title}</h2>
            <p>{settings.about_text}</p>
            <ul className="intro-points">
              {points.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/tentang" className="btn btn-primary">
              Selengkapnya <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <SectionHead
              eyebrow="Produk Unggulan"
              title="Produk aluminium untuk kebutuhan industri"
              description="Pilihan produk yang paling banyak digunakan untuk konstruksi, otomotif, dan aplikasi industri."
            />
            <Link
              to="/produk"
              className="btn btn-outline"
              style={{ marginBottom: 48 }}
            >
              Lihat Semua Produk <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {products.loading ? <SkeletonGrid count={4} /> : null}
          {!products.loading && products.data?.length ? (
            <div className="grid grid-4">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
          {!products.loading && !products.data?.length ? (
            <p className="muted">
              Belum ada produk unggulan yang dipublikasikan.
            </p>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Layanan Kami"
            title="Layanan manufaktur dari spesifikasi hingga pengiriman"
            description="Setiap layanan disesuaikan dengan kebutuhan teknis dan volume produksi pelanggan."
          />
          {services.loading ? <SkeletonGrid count={3} /> : null}
          {!services.loading && services.data?.length ? (
            <div className="grid grid-3">
              {services.data.slice(0, 4).map((service, index) => (
                <Reveal key={service.id} delay={index * 60}>
                  <article className="card service-card">
                    {service.image?.url ? (
                      <img
                        src={service.image.url}
                        alt={service.image.alt || service.title}
                        loading="lazy"
                      />
                    ) : null}
                    <div className="service-body">
                      <span className="service-index">
                        LAYANAN {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <Link to="/layanan" className="link-arrow">
                        Lihat Layanan{" "}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHead
            eyebrow="Mengapa Kami"
            title="Alasan pelanggan mempercayakan kebutuhan aluminium kepada kami"
            description="Kami menjaga kualitas melalui proses kerja yang terukur dan komunikasi yang jelas."
          />
          <WhyChooseUs items={settings.why_items} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <StatsBand stats={settings.stats} />
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 96 }}>
        <div className="container">
          <CTABand title={settings.cta_title} text={settings.cta_text}>
            <Link to="/kontak" className="btn btn-primary">
              Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/produk" className="btn btn-outline">
              Lihat Produk
            </Link>
          </CTABand>
        </div>
      </section>
    </>
  );
}
