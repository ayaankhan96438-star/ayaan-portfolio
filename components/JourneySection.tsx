import { Award, BookOpen, BriefcaseBusiness, Code2, Milestone } from "lucide-react";
import { journeyItems } from "@/data/journey";

const icons = {
  Learning: BookOpen,
  Project: Code2,
  Experience: BriefcaseBusiness,
  Achievement: Award,
} as const;

export function JourneySection() {
  return (
    <section className="section journey-section" id="journey" aria-labelledby="journey-title">
      <div className="section-heading" data-cinematic-reveal>
        <span className="section-number">04</span>
        <h2 id="journey-title">The journey so far<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">LEARNING / BUILDING / GROWING</span>
      </div>

      <div className="journey-intro" data-cinematic-reveal>
        <p>A work in progress, by design. A few real projects and learning milestones — with room for the next chapter.</p>
        <span><Milestone size={15} /> UPDATED AS I GROW</span>
      </div>

      <ol className="journey-list">
        {journeyItems.map((item, index) => {
          const Icon = icons[item.kind];
          return (
            <li className={`journey-item${item.placeholder ? " journey-item-placeholder" : ""}`} key={item.id} data-cinematic-reveal>
              <div className="journey-marker"><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></div>
              <div className="journey-date">{item.date}</div>
              <div className="journey-copy">
                <div className="journey-copy-top"><span>{item.kind}</span>{item.placeholder ? <span className="journey-editable">EDITABLE SLOT</span> : null}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="journey-index">{String(index + 1).padStart(2, "0")}</span>
            </li>
          );
        })}
      </ol>
      <p className="journey-footnote">Experience and achievement entries are intentionally left as editable placeholders until verified details are added in <code>data/journey.ts</code>.</p>
    </section>
  );
}
