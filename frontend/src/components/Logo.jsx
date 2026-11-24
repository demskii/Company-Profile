import { useSettings } from '../context/SettingsContext';

export default function Logo({ light = false, name, subtitle = 'Manufaktur Aluminium' }) {
  const { settings, image, imageAlt } = useSettings();
  const label = name || settings.company_name || 'ALUMINDO SEJAHTERA';
  const logoUrl = image('logo_id');

  return (
    <span className={`brand${light ? ' brand--light' : ''}`}>
      {logoUrl ? (
        <span className="brand-logo">
          <img src={logoUrl} alt={imageAlt('logo_id', label)} />
        </span>
      ) : (
        <>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18 9 6l5 12"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.4 14h5.2"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M16 6v12h4"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-name" style={light ? { color: '#fff' } : undefined}>
              {label}
            </span>
            <span className="brand-sub" style={light ? { color: '#8fb3c9' } : undefined}>
              {subtitle}
            </span>
          </span>
        </>
      )}
    </span>
  );
}
