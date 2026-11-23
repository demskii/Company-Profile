export default function SectionHead({ eyebrow, title, description, center = false }) {
  return (
    <div className={`section-head${center ? ' section-head--center' : ''}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
