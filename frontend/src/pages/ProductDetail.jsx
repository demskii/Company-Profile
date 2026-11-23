import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Package } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import { EmptyState, PageLoader } from '../components/States';
import { useSettings } from '../context/SettingsContext';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { parseSpecifications, whatsappLink } from '../utils/format';

export default function ProductDetail() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const product = useFetch(() => api.get(`/products/${slug}`), [slug]);
  const categorySlug = product.data?.category?.slug;
  const related = useFetch(
    () => api.get('/products', { params: { category: categorySlug, limit: 4 } }),
    [categorySlug],
    { enabled: Boolean(categorySlug) },
  );

  if (product.loading) return <PageLoader />;

  if (product.error) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Produk tidak ditemukan"
            description={getErrorMessage(product.error)}
            action={
              <Link to="/produk" className="btn btn-primary">
                <ArrowLeft size={16} aria-hidden="true" /> Kembali ke Produk
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const data = product.data;
  const specs = parseSpecifications(data.specifications);
  const wa = whatsappLink(
    settings.contact_whatsapp,
    `Halo, saya ingin meminta penawaran untuk produk ${data.name}.`,
  );
  const relatedItems = (related.data || []).filter((item) => item.id !== data.id).slice(0, 3);

  return (
    <>
      <SEO title={data.name} description={data.short_description} />
      <PageHeader
        title={data.name}
        breadcrumb={[
          { label: 'Produk', to: '/produk' },
          { label: data.category?.name || 'Kategori', to: `/produk/kategori/${data.category?.slug}` },
          { label: data.name },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-media">
              {data.image?.url ? (
                <img src={data.image.url} alt={data.image.alt || data.name} />
              ) : (
                <span style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#9aabb9' }}>
                  <Package size={56} aria-hidden="true" />
                </span>
              )}
            </div>

            <div className="detail-copy">
              <span className="tag">{data.category?.name}</span>
              <h1>{data.name}</h1>
              <p className="lead">{data.short_description}</p>

              {specs.length ? (
                <table className="spec-table">
                  <caption className="sr-only" style={{ position: 'absolute', left: -9999 }}>
                    Spesifikasi {data.name}
                  </caption>
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr key={`${spec.label}-${index}`}>
                        <th scope="row">{spec.label || 'Spesifikasi'}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}

              <div className="detail-actions">
                {wa ? (
                  <a className="btn btn-accent" href={wa} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={17} aria-hidden="true" /> Minta Penawaran
                  </a>
                ) : null}
                <Link to="/kontak" className="btn btn-outline">
                  Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="prose" style={{ marginTop: 32 }}>
                <h3>Deskripsi Produk</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{data.description}</p>
                <ul className="check-list">
                  <li><CheckCircle2 size={16} aria-hidden="true" /> Spesifikasi dapat disesuaikan dengan kebutuhan proyek.</li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /> Konsultasikan volume dan tenggat produksi dengan tim kami.</li>
                </ul>
              </div>
            </div>
          </div>

          {relatedItems.length ? (
            <div style={{ marginTop: 72 }}>
              <div className="section-head">
                <span className="eyebrow">Produk Terkait</span>
                <h2>Produk lain dalam kategori ini</h2>
              </div>
              <div className="grid grid-3">
                {relatedItems.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
