import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <article className="card product-card">
      <Link to={`/produk/${product.slug}`} className="product-media" aria-label={product.name}>
        {product.image?.url ? (
          <img src={product.image.url} alt={product.image.alt || product.name} loading="lazy" />
        ) : (
          <span style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#9aabb9' }}>
            <Package size={38} aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className="product-body">
        <span className="tag">{product.category?.name || 'Produk'}</span>
        <h3>
          <Link to={`/produk/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.short_description}</p>
        <Link to={`/produk/${product.slug}`} className="link-arrow">
          Lihat Detail <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
