"use client";

import {
  Braces,
  Code2,
  Database,
  GitBranch,
  Monitor,
  Server,
  Terminal,
  Workflow,
} from "lucide-react";
import { skillGroups } from "@/data/skills";

const groupIcons = [Monitor, Server, Database, Code2];

export function PlaygroundSection() {
  return (
    <section className="section playground-section" id="playground" aria-labelledby="stack-title" data-spotlight-zone>
      <div className="section-heading" data-cinematic-reveal>
        <span className="section-number">03</span>
        <h2 id="stack-title">Tools of the trade<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">A PRACTICAL STACK / ALWAYS LEARNING</span>
      </div>

      <div className="playground-intro stack-intro" data-cinematic-reveal>
        <h3>Built across<br /><span>the stack.</span></h3>
        <p>From the first interface detail to the data behind it — here are the technologies I work with and keep exploring.</p>
      </div>

      <div className="stack-grid" data-cinematic-stagger>
        {skillGroups.map((group, index) => {
          const Icon = groupIcons[index] ?? Code2;
          return (
            <article
              className="stack-card"
              key={group.number}
              data-cinematic-item
              data-tilt-card
              onPointerMove={(event) => {
                if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;
                event.currentTarget.style.setProperty("--card-spot-x", `${x * 100}%`);
                event.currentTarget.style.setProperty("--card-spot-y", `${y * 100}%`);
                event.currentTarget.style.setProperty("--card-tilt-x", `${(0.5 - y) * 2.5}deg`);
                event.currentTarget.style.setProperty("--card-tilt-y", `${(x - 0.5) * 3}deg`);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--card-tilt-x", "0deg");
                event.currentTarget.style.setProperty("--card-tilt-y", "0deg");
              }}
            >
              <div className="stack-card-top">
                <span className="stack-card-number">{group.number} / 04</span>
                <span className="stack-card-icon"><Icon size={20} strokeWidth={1.65} aria-hidden="true" /></span>
              </div>
              <h3>{group.title}</h3>
              <p className="stack-card-description">{group.description}</p>
              <div className="stack-tags" aria-label={`${group.title} technologies`}>
                {group.skills.map((skill) => (
                  <span className={skill === "MongoDB" ? "stack-tag stack-tag-learning" : "stack-tag"} key={skill}>
                    {skill}
                    {skill === "MongoDB" ? <span className="stack-learning-dot" aria-hidden="true" /> : null}
                  </span>
                ))}
              </div>
              {group.note ? <p className="stack-card-note"><span />{group.note}</p> : <span className="stack-card-footer"><Workflow size={13} /> BUILD · TEST · REFINE</span>}
            </article>
          );
        })}
      </div>
      <div className="stack-footnote">
        <span><Braces size={15} /> PRACTICE OVER HYPE</span>
        <span><GitBranch size={15} /> LEARNING IN PUBLIC</span>
        <span><Terminal size={15} /> SHIP SOMETHING USEFUL</span>
        <span className="sr-only">Programming and development technologies</span>
      </div>
    </section>
  );
}
