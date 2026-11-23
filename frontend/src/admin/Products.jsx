import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { api, getErrorMessage } from '../services/api';
import { useToast } from '../components/Toast';
import { StatusBadge, TableSkeleton } from '../components/admin/AdminBits';
import { EmptyState } from '../components/States';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/format';

export default function AdminProducts() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('kategori') || '');
  const [status, setStatus] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const categories = useFetch(() => api.get('/categories', { params: { status: 'all', limit: 100 } }), []);
  const products = useFetch(
    () => api.get('/products', { params: { page, limit: 10, search, category, status, sort: 'newest' } }),
    [page, search, category, status],
  );

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api.delete(`/products/${deleting.id}`);
      toast('Produk berhasil dihapus.', 'success');
      setDeleting(null);
      if (products.data?.length === 1 && page > 1) setPage(page - 1);
      else products.reload();
    } catch (error) {
      toast(getErrorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h2>Daftar Produk</h2>
          <p>{products.meta ? `${products.meta.total} produk terdaftar` : 'Kelola katalog produk aluminium.'}</p>
        </div>
        <Link to="/admin/produk/baru" className="btn btn-primary btn-sm">
          <Plus size={15} aria-hidden="true" /> Tambah Produk
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari nama produk..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Cari produk"
          />
        </div>
        <select
          className="select"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          aria-label="Filter kategori"
        >
          <option value="">Semua kategori</option>
          {(categories.data || []).map((item) => (
            <option key={item.id} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <select
          className="select"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter status"
        >
          <option value="all">Semua status</option>
          <option value="published">Hanya terbit</option>
        </select>
      </div>

      {products.loading ? <TableSkeleton rows={6} /> : null}

      {products.error ? (
        <EmptyState
          title="Produk gagal dimuat"
          description={getErrorMessage(products.error)}
          action={<button type="button" className="btn btn-primary" onClick={products.reload}>Coba Lagi</button>}
        />
      ) : null}

      {!products.loading && !products.error && products.data?.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk ditampilkan di website."
          action={<Link to="/admin/produk/baru" className="btn btn-primary">Tambah Produk</Link>}
        />
      ) : null}

      {!products.loading && products.data?.length ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Unggulan</th>
                  <th>Diperbarui</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.data.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="table-product">
                        {product.image?.url ? (
                          <img className="table-thumb" src={product.image.url} alt="" />
                        ) : (
                          <span className="table-thumb" aria-hidden="true" />
                        )}
                        <div>
                          <strong>{product.name}</strong>
                          <span>/{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.name}</td>
                    <td><StatusBadge active={product.is_published} activeLabel="Terbit" /></td>
                    <td>
                      {product.is_featured ? <span className="badge badge--warning">Unggulan</span> : <span className="muted">-</span>}
                    </td>
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(product.updated_at)}</td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="icon-btn"
                          to={`/produk/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Lihat ${product.name}`}
                        >
                          <Eye size={15} />
                        </Link>
                        <Link className="icon-btn" to={`/admin/produk/${product.id}/edit`} aria-label={`Edit ${product.name}`}>
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => setDeleting(product)}
                          aria-label={`Hapus ${product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={products.meta?.page || 1} totalPages={products.meta?.totalPages || 1} onChange={setPage} />
        </>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus produk?"
        message={`Produk "${deleting?.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        loading={busy}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
