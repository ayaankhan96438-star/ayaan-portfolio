"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <section className="section playground-section" id="playground" aria-labelledby="stack-title">
      <div className="section-heading">
        <span className="section-number">03</span>
        <h2 id="stack-title">Tools of the trade<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">A PRACTICAL STACK / ALWAYS LEARNING</span>
      </div>

      <div className="playground-intro stack-intro">
        <h3>Built across<br /><span>the stack.</span></h3>
        <p>From the first interface detail to the data behind it — here are the technologies I work with and keep exploring.</p>
      </div>

      <div className="stack-grid">
        {skillGroups.map((group, index) => {
          const Icon = groupIcons[index] ?? Code2;
          return (
            <motion.article
              className="stack-card"
              key={group.number}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.32, delay: index * 0.055, ease: "easeOut" }}
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
            </motion.article>
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
