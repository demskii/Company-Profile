import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { EmptyState, SkeletonGrid } from '../components/States';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { getErrorMessage } from '../services/api';

export default function Products() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('order');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const categories = useFetch(() => api.get('/categories'), []);
  const products = useFetch(
    () => api.get('/products', { params: { page, limit: 9, search, category, sort } }),
    [page, search, category, sort],
  );

  return (
    <>
      <SEO title="Produk" description="Katalog produk aluminium Alumindo Sejahtera untuk konstruksi, otomotif, dan industri." />
      <PageHeader
        title="Produk Aluminium"
        description="Temukan profil, komponen, panel, dan aksesoris aluminium sesuai kebutuhan proyek Anda."
        breadcrumb={[{ label: 'Produk' }]}
      />

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter kategori">
              <button
                type="button"
                className={`chip${category === '' ? ' active' : ''}`}
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
              >
                Semua Produk
              </button>
              {(categories.data || []).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip${category === item.slug ? ' active' : ''}`}
                  onClick={() => {
                    setCategory(item.slug);
                    setPage(1);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="search-box">
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Cari produk..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  aria-label="Cari produk"
                />
              </div>
              <select
                className="select"
                style={{ width: 'auto' }}
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                aria-label="Urutkan produk"
              >
                <option value="order">Urutan tampil</option>
                <option value="newest">Terbaru</option>
                <option value="name">Nama A-Z</option>
              </select>
            </div>
          </div>

          {products.loading ? <SkeletonGrid count={6} /> : null}

          {products.error ? (
            <EmptyState
              title="Produk gagal dimuat"
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
              title="Produk tidak ditemukan"
              description="Coba kata kunci lain atau pilih kategori yang berbeda."
              action={
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                    setCategory('');
                  }}
                >
                  Reset Filter
                </button>
              }
            />
          ) : null}

          {!products.loading && !products.error && products.data?.length ? (
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
