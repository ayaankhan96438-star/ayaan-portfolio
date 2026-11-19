import { BookOpen, Code2, Milestone } from "lucide-react";
import { journeyItems } from "@/data/journey";

const icons = {
  Learning: BookOpen,
  Project: Code2,
} as const;

export function JourneySection() {
  return (
    <section className="section journey-section" id="journey" data-spotlight-zone aria-labelledby="journey-title">
      <div className="section-heading" data-cinematic-reveal>
        <span className="section-number">04</span>
        <h2 id="journey-title">The journey so far<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">LEARNING / BUILDING / GROWING</span>
      </div>

      <div className="journey-intro" data-cinematic-reveal>
        <p>A work in progress, by design. A few real projects and learning milestones — with room for the next chapter.</p>
        <span><Milestone size={15} /> UPDATED AS I GROW</span>
      </div>

      <ol className="journey-list" data-cinematic-stagger>
        {journeyItems.map((item, index) => {
          const Icon = icons[item.kind];
          return (
            <li className="journey-item" key={item.id} data-cinematic-item>
              <div className="journey-marker"><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></div>
              <div className="journey-date">{item.date}</div>
              <div className="journey-copy">
                <div className="journey-copy-top"><span>{item.kind}</span></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="journey-index">{String(index + 1).padStart(2, "0")}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
