"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { BrowserWindow } from "@/components/BrowserWindow";
import { projects } from "@/data/projects";
import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

const featuredProjects = projects.slice(0, 2);

function updateCardTilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  event.currentTarget.style.setProperty("--hero-tilt-x", `${(0.5 - y) * 5}deg`);
  event.currentTarget.style.setProperty("--hero-tilt-y", `${(x - 0.5) * 6}deg`);
  event.currentTarget.style.setProperty("--hero-lift", "-7px");
}

function resetCardTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--hero-tilt-x", "0deg");
  event.currentTarget.style.setProperty("--hero-tilt-y", "0deg");
  event.currentTarget.style.setProperty("--hero-lift", "0px");
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revealTimeline: gsap.core.Timeline | null = null;
    const context = gsap.context(() => {
      revealTimeline = gsap.timeline({ paused: true });
      revealTimeline
        .fromTo(
          ".hero-kicker",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          ".hero-title-line",
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power4.out" },
          "-=0.25",
        )
        .fromTo(
          ".hero-description, .hero-cta-row, .hero-trustline",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" },
          "-=0.48",
        )
        .fromTo(
          ".hero-project-card",
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.16,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          "-=0.6",
        );
    }, root);

    const revealAfterPreloader = () => revealTimeline?.play(0);
    const waitingForPreloader = document.documentElement.dataset.intro === "playing";

    if (waitingForPreloader) {
      window.addEventListener("preloader:done", revealAfterPreloader, { once: true });
    } else {
      revealAfterPreloader();
    }

    return () => {
      window.removeEventListener("preloader:done", revealAfterPreloader);
      context.revert();
    };
  }, []);

  return (
    <section className="hero-section hero-section--showcase" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">SOFTWARE DEVELOPER · DIGITAL CRAFT</span>
        <span className="hero-index">INDEPENDENTLY BUILT / ALWAYS ITERATING</span>
      </div>

      <div className="hero-showcase-grid">
        <div className="hero-copy">
          <span className="hero-kicker">THOUGHTFUL DESIGN. USEFUL CODE.</span>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-title-mask"><span className="hero-title-line">Ideas into</span></span>
            <span className="hero-title-mask"><span className="hero-title-line">digital</span></span>
            <span className="hero-title-mask"><span className="hero-title-line hero-title-line--accent">experiences<span className="hero-dot">.</span></span></span>
          </h1>
          <p className="hero-description">
            Thoughtful websites and useful digital products, built one idea at a time.
          </p>
          <div className="hero-cta-row">
            <Link href="#work" className="hero-primary-cta">
              Explore selected work <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link href="#contact" className="hero-secondary-cta">Have an idea? Let&apos;s talk</Link>
          </div>
          <div className="hero-trustline">
            <span className="hero-trustline-dot" aria-hidden="true" />
            <span>02 SELECTED PROJECTS</span>
            <span className="hero-trustline-divider" aria-hidden="true" />
            <span>BUILT WITH CURIOSITY</span>
          </div>
        </div>

        <div className="hero-showcase-stage" aria-label="Featured projects">
          {featuredProjects.map((project, index) => (
            <article
              className={`hero-project-card hero-project-card--${index === 0 ? "amaan" : "books"}`}
              key={project.slug}
              onPointerMove={updateCardTilt}
              onPointerLeave={resetCardTilt}
            >
              <Link href={`/work/${project.slug}`} className="hero-project-card-link" aria-label={`View ${project.title} project`}>
                <div className="hero-project-visual">
                  <BrowserWindow
                    src={project.image}
                    alt={project.imageAlt}
                    sizes="(max-width: 640px) 46vw, (max-width: 1000px) 42vw, 38vw"
                    priority
                    className="hero-project-browser"
                    address={project.liveUrl || "Ayaan Khan / Selected work"}
                  />
                </div>
                <div className="hero-project-card-details">
                  <div className="hero-project-card-title-wrap">
                    <span className="hero-project-card-index">{project.number} / 02 · {project.category}</span>
                    <h2>{project.title}</h2>
                  </div>
                  <span className="hero-project-card-link-label">
                    VIEW PROJECT <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
          <div className="hero-showcase-stamp" aria-hidden="true">
            <span>SELECTED</span>
            <strong>WORK</strong>
            <span>2026 · 01—02</span>
          </div>
        </div>
      </div>

      <div className="hero-bottomline">
        <p>FROM THE FIRST SKETCH<br />TO THE FINISHED INTERFACE.</p>
        <Link href="#work" className="scroll-cue">
          <span>Scroll to explore</span>
          <ArrowDownRight size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <span className="hero-side-note">GOOD IDEAS DESERVE<br />GOOD EXECUTION.</span>
      </div>
    </section>
  );
}
