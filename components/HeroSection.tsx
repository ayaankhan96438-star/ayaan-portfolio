"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { BrowserWindow } from "@/components/BrowserWindow";
import { projects } from "@/data/projects";
import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

const featuredProjects = projects.slice(0, 2);

function handleProjectPointerMove(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const tilt = event.currentTarget.querySelector<HTMLElement>(".hero-floating-project-tilt");
  if (!tilt) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  tilt.style.setProperty("--hero-rotate-x", `${(0.5 - y) * 7}deg`);
  tilt.style.setProperty("--hero-rotate-y", `${(x - 0.5) * 9}deg`);
  tilt.style.setProperty("--hero-card-lift", "-8px");
}

function handleProjectPointerLeave(event: PointerEvent<HTMLElement>) {
  const tilt = event.currentTarget.querySelector<HTMLElement>(".hero-floating-project-tilt");
  if (!tilt) return;
  tilt.style.setProperty("--hero-rotate-x", "0deg");
  tilt.style.setProperty("--hero-rotate-y", "0deg");
  tilt.style.setProperty("--hero-card-lift", "0px");
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let revealTimeline: gsap.core.Timeline | null = null;
    const context = gsap.context(() => {
      revealTimeline = gsap.timeline({ paused: true });
      revealTimeline
        .fromTo(
          ".hero-orbit-kicker",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
        )
        .fromTo(
          ".hero-orbit-title-line",
          { yPercent: 112, rotate: 2, autoAlpha: 0 },
          {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.05,
            stagger: 0.13,
            ease: "power4.out",
            clearProps: "transform,opacity,visibility",
          },
          "-=0.28",
        )
        .fromTo(
          ".hero-orbit-description, .hero-orbit-actions, .hero-orbit-process",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.1, ease: "power3.out" },
          "-=0.55",
        )
        .fromTo(
          ".hero-floating-project",
          { y: 48, autoAlpha: 0, scale: 0.94 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 1, stagger: 0.18, ease: "power3.out", clearProps: "transform,opacity,visibility" },
          "-=0.58",
        )
        .fromTo(
          ".hero-orbit-decor",
          { scale: 0.6, autoAlpha: 0, rotate: -18 },
          { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.1, stagger: 0.08, ease: "back.out(1.35)" },
          "-=0.9",
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
    <section className="hero-section hero-section--floating" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">SOFTWARE DEVELOPER · DIGITAL CRAFT</span>
        <span className="hero-index">INDEPENDENTLY BUILT / ALWAYS ITERATING</span>
      </div>

      <div className="hero-floating-layout">
        <div className="hero-floating-copy">
          <div className="hero-orbit-kicker">
            <span className="hero-orbit-kicker-dot" aria-hidden="true" />
            <span>PERSONAL PROJECTS · OPEN TO LEARNING</span>
          </div>

          <h1 className="hero-orbit-title" id="hero-title">
            <span className="hero-orbit-title-mask"><span className="hero-orbit-title-line hero-orbit-title-build">BUILD<span className="hero-orbit-title-period">.</span></span></span>
            <span className="hero-orbit-title-mask"><span className="hero-orbit-title-line">ideas into</span></span>
            <span className="hero-orbit-title-mask"><span className="hero-orbit-title-line hero-orbit-title-accent">real experiences.</span></span>
          </h1>

          <p className="hero-orbit-description">
            I&apos;m Ayaan — learning, experimenting, and turning ideas into thoughtful digital experiences.
          </p>

          <div className="hero-orbit-actions">
            <Link href="#work" className="hero-orbit-primary">
              Explore my work <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link href="#contact" className="hero-orbit-secondary">Let&apos;s connect</Link>
          </div>

          <div className="hero-orbit-process" aria-label="My creative process: plan, experiment, improve">
            <span><i>01</i> PLAN</span>
            <span className="hero-orbit-process-line" aria-hidden="true" />
            <span><i>02</i> EXPERIMENT</span>
            <span className="hero-orbit-process-line" aria-hidden="true" />
            <span><i>03</i> IMPROVE</span>
          </div>
        </div>

        <div className="hero-orbit-scene" aria-label="Two featured portfolio projects">
          <div className="hero-orbit-ring hero-orbit-ring--one hero-orbit-decor" aria-hidden="true" />
          <div className="hero-orbit-ring hero-orbit-ring--two hero-orbit-decor" aria-hidden="true" />
          <div className="hero-orbit-ring-core hero-orbit-decor" aria-hidden="true" />
          <span className="hero-orbit-sphere hero-orbit-sphere--orange hero-orbit-decor" aria-hidden="true" />
          <span className="hero-orbit-sphere hero-orbit-sphere--green hero-orbit-decor" aria-hidden="true" />
          <span className="hero-orbit-sphere hero-orbit-sphere--cream hero-orbit-decor" aria-hidden="true" />
          <span className="hero-orbit-cross hero-orbit-cross--one hero-orbit-decor" aria-hidden="true">+</span>
          <span className="hero-orbit-cross hero-orbit-cross--two hero-orbit-decor" aria-hidden="true">+</span>

          {featuredProjects.map((project, index) => (
            <article
              className={`hero-floating-project hero-floating-project--${index === 0 ? "primary" : "secondary"}`}
              key={project.slug}
              onPointerMove={handleProjectPointerMove}
              onPointerLeave={handleProjectPointerLeave}
            >
              <div className="hero-floating-project-drift">
                <div className="hero-floating-project-tilt">
                  <Link href={`/work/${project.slug}`} className="hero-floating-project-link" aria-label={`Explore ${project.title}`}>
                    <div className="hero-floating-project-browser">
                      <BrowserWindow
                        src={project.image}
                        alt={project.imageAlt}
                        sizes="(max-width: 640px) 76vw, (max-width: 1000px) 46vw, 35vw"
                        priority
                        className="hero-floating-browser"
                        address={project.liveUrl || "Ayaan Khan / Selected work"}
                      />
                    </div>
                    <div className="hero-floating-project-meta">
                      <div>
                        <span className="hero-floating-project-index">PROJECT {project.number} / {project.category}</span>
                        <strong>{project.title}</strong>
                      </div>
                      <span className="hero-floating-project-arrow"><ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></span>
                    </div>
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div className="hero-orbit-center-label hero-orbit-decor" aria-hidden="true">
            <Sparkles size={13} strokeWidth={1.7} />
            <span>MADE BY CURIOSITY</span>
          </div>
          <div className="hero-orbit-caption" aria-hidden="true">
            <span>SELECTED WORK</span><strong>01 — 02</strong>
          </div>
        </div>
      </div>

      <div className="hero-bottomline hero-floating-bottomline">
        <p>SMALL IDEAS.<br />REAL-WORLD EXPERIMENTS.</p>
        <Link href="#work" className="scroll-cue">
          <span>Scroll to explore</span>
          <ArrowDownRight size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <span className="hero-side-note">LEARN SOMETHING.<br />MAKE SOMETHING.</span>
      </div>
    </section>
  );
}
