import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { EmptyState, SkeletonGrid } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const category = useFetch(() => api.get(`/categories/${slug}`), [slug]);
  const products = useFetch(
    () => api.get('/products', { params: { category: slug, page, limit: 9 } }),
    [slug, page],
  );

  const name = category.data?.name || 'Kategori Produk';

  return (
    <>
      <SEO title={name} description={category.data?.description} />
      <PageHeader
        title={name}
        description={category.data?.description || 'Produk aluminium dalam kategori ini.'}
        breadcrumb={[{ label: 'Produk', to: '/produk' }, { label: name }]}
      />

      <section className="section">
        <div className="container">
          {products.loading ? <SkeletonGrid count={6} /> : null}

          {products.error ? (
            <EmptyState
              title="Kategori gagal dimuat"
              description={getErrorMessage(products.error)}
              action={
                <button type="button" className="btn btn-primary" onClick={products.reload}>
                  Coba Lagi
                </button>
              }
            />
          ) : null}

          {!products.loading && !products.error && products.data?.length === 0 ? (
            <EmptyState
              title="Belum ada produk"
              description="Kategori ini belum memiliki produk yang dipublikasikan."
            />
          ) : null}

          {!products.loading && products.data?.length ? (
            <>
              <div className="grid grid-3">
                {products.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={products.meta?.page || 1} totalPages={products.meta?.totalPages || 1} onChange={setPage} />
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
