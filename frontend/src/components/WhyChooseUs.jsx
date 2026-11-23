import { BadgeCheck, Cpu, Puzzle, ShieldCheck, Timer } from 'lucide-react';

const icons = [ShieldCheck, Timer, Cpu, BadgeCheck, Puzzle];

export default function WhyChooseUs({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="why-grid">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article className="why-item" key={`${item.title}-${index}`}>
            <div className="why-icon">
              <Icon size={22} aria-hidden="true" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}
