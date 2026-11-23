import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function StatsBand({ stats = [] }) {
  if (!stats.length) return null;
  return (
    <Reveal>
      <div className="stats-band">
        {stats.map((item) => (
          <div className="stat" key={`${item.label}-${item.value}`}>
            <div className="stat-value">
              {item.value}
              {item.suffix ? <span>{item.suffix}</span> : null}
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function CTABand({ title, text, children }) {
  return (
    <Reveal>
      <div className="cta-band">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {children || (
            <Link to="/kontak" className="btn btn-primary">
              Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}
