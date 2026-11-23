import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ title, description, breadcrumb = [] }) {
  return (
    <section className="page-hero">
      <div className="container">
        {breadcrumb.length > 0 ? (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Beranda</Link>
            {breadcrumb.map((item) => (
              <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ChevronRight size={13} aria-hidden="true" />
                {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
              </span>
            ))}
          </nav>
        ) : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
    </section>
  );
}
