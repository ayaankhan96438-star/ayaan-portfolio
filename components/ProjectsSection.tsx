"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/projects";
import { BrowserWindow } from "@/components/BrowserWindow";

export function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 32, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 32, mass: 0.5 });
  const cursorScale = useMotionValue(0);
  const smoothScale = useSpring(cursorScale, { stiffness: 300, damping: 24 });
  const projectCount = String(projects.length).padStart(2, "0");

  return (
    <section className="section projects-section" id="work">
      <div className="section-heading">
        <span className="section-number">02</span>
        <h2>A few things<br className="mobile-break" /> I&apos;ve built<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">SELECTED WORK / 2026</span>
      </div>

      <div
        className="projects-grid"
        onPointerMove={(event) => {
          cursorX.set(event.clientX);
          cursorY.set(event.clientY);
        }}
        onPointerLeave={() => cursorScale.set(0)}
      >
        {projects.map((project, index) => {
          const isFeatured = project.slug === "amaantrader";
          return (
          <motion.article
            className={`project-card project-card-${index + 1}${isFeatured ? " project-card-featured" : ""}`}
            key={project.slug}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 28 }}
            onHoverStart={() => { if (!shouldReduceMotion) cursorScale.set(1); }}
            onHoverEnd={() => cursorScale.set(0)}
          >
            <Link
              href={`/work/${project.slug}`}
              className="project-link"
              aria-label={`View case study: ${project.title}`}
              onFocus={() => cursorScale.set(0)}
            >
              <div className="project-image-wrap">
                <BrowserWindow
                  src={project.image}
                  alt={project.imageAlt}
                  sizes={isFeatured
                    ? "(max-width: 640px) 100vw, (max-width: 900px) 84vw, 76vw"
                    : "(max-width: 640px) 100vw, (max-width: 900px) 48vw, 42vw"}
                  address={project.liveUrl || "Local project preview"}
                  priority={isFeatured}
                  className="project-browser-window"
                />
                <span className="project-image-index">{project.number} / {projectCount}</span>
                <span className="project-image-arrow"><ArrowUpRight size={20} /></span>
              </div>
              <div className="project-info">
                <div>
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                </div>
                <span className="project-year">{project.year}</span>
              </div>
              <div className="project-tags" aria-label="Technologies">
                {project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </Link>
            <div className="project-actions" aria-label={`${project.title} project links`}>
              {project.liveUrl ? (
                <a className="project-action project-action-live" href={project.liveUrl} target="_blank" rel="noreferrer">
                  <span>Live Demo</span><ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : null}
              {project.githubUrl ? (
                <a className="project-action project-action-github" href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github size={14} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </motion.article>
          );
        })}

        <motion.div className="project-view-cursor" style={{ x: springX, y: springY, scale: smoothScale }} aria-hidden="true">
          View <ArrowUpRight size={14} />
        </motion.div>
      </div>
      <div className="projects-footnote"><span>{projects.length} {projects.length === 1 ? "BUILD" : "BUILDS"}. MANY LATE NIGHTS.</span><span>MORE ON THE WAY ↗</span></div>
    </section>
  );
}
