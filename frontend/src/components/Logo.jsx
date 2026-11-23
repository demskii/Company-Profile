export default function Logo({
  light = false,
  name = "ALUMINDO SEJAHTERA",
  subtitle = "Manufaktur Aluminium",
}) {
  return (
    <span className="brand">
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
        <span
          className="brand-name"
          style={light ? { color: "#fff" } : undefined}
        >
          {name}
        </span>
        <span
          className="brand-sub"
          style={light ? { color: "#8fb3c9" } : undefined}
        >
          {subtitle}
        </span>
      </span>
    </span>
  );
}
