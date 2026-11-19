"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";

function handleStagePointerMove(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--laptop-rotate-x", `${y * -7}deg`);
  event.currentTarget.style.setProperty("--laptop-rotate-y", `${x * 9}deg`);
  event.currentTarget.style.setProperty("--laptop-shift-x", `${x * 7}px`);
  event.currentTarget.style.setProperty("--laptop-shift-y", `${y * 7}px`);
}

function resetStagePointer(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.setProperty("--laptop-rotate-x", "0deg");
  event.currentTarget.style.setProperty("--laptop-rotate-y", "0deg");
  event.currentTarget.style.setProperty("--laptop-shift-x", "0px");
  event.currentTarget.style.setProperty("--laptop-shift-y", "0px");
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revealTimeline: gsap.core.Timeline | null = null;
    const context = gsap.context(() => {
      revealTimeline = gsap.timeline({ paused: true });
      const navLogo = document.querySelector<HTMLElement>(".site-nav .nav-logo");
      if (navLogo) {
        revealTimeline.fromTo(
          navLogo,
          { y: -8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.58, ease: "power3.out" },
          0,
        );
      }
      revealTimeline
        .fromTo(
          ".hero-topline",
          { y: -12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.62, ease: "power3.out" },
        )
        .fromTo(
          ".hero-kicker",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
        )
        .fromTo(
          ".hero-word-line",
          { yPercent: 115, rotate: 2, autoAlpha: 0 },
          {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.13,
            ease: "power4.out",
            clearProps: "transform,opacity,visibility",
          },
          "-=0.2",
        )
        .fromTo(
          ".hero-description, .hero-cta-row, .hero-process",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.09, ease: "power3.out" },
          "-=0.48",
        )
        .fromTo(
          ".hero-stage-glow",
          { scale: 0.76, autoAlpha: 0, filter: "blur(28px)" },
          { scale: 1, autoAlpha: 1, filter: "blur(12px)", duration: 1.25, ease: "power2.out" },
          "-=0.9",
        )
        .fromTo(
          ".hero-laptop-wrap",
          { y: 42, scale: 0.86, rotationY: -9, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            rotationY: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          "-=0.95",
        )
        .fromTo(
          ".hero-orbit, .hero-orb, .hero-floating-label",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: "power2.out" },
          "-=0.85",
        )
        .fromTo(
          ".hero-bottomline",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.62, ease: "power3.out" },
          "-=0.55",
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
    <section className="hero-section hero-section--floating" id="home" data-spotlight-zone ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">SOFTWARE DEVELOPER · DIGITAL CRAFT</span>
        <span className="hero-index">INDEPENDENTLY BUILT / ALWAYS ITERATING</span>
      </div>

      <div className="hero-layout">
        <div className="hero-copy">
          <span className="hero-kicker">IDEAS INTO DIGITAL EXPERIENCES</span>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-word-mask"><span className="hero-word-line">BUILD<span className="hero-dot">.</span></span></span>
            <span className="hero-word-mask"><span className="hero-word-line">SHAPE<span className="hero-dot">.</span></span></span>
            <span className="hero-word-mask"><span className="hero-word-line hero-word-line--accent">LAUNCH<span className="hero-dot">.</span></span></span>
          </h1>
          <p className="hero-description">
            Turning curious ideas into thoughtful websites and digital experiences, one project at a time.
          </p>
          <div className="hero-cta-row">
            <Link href="#work" className="hero-primary-cta">
              Explore projects <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link href="#contact" className="hero-secondary-cta">Let&apos;s connect</Link>
          </div>
          <div className="hero-process" aria-label="Build, shape, launch">
            <span><b>01</b> BUILD</span>
            <i aria-hidden="true" />
            <span><b>02</b> SHAPE</span>
            <i aria-hidden="true" />
            <span><b>03</b> LAUNCH</span>
          </div>
        </div>

        <div
          className="hero-3d-stage"
          role="img"
          aria-label="A floating three-dimensional laptop with orbiting shapes"
          onPointerMove={handleStagePointerMove}
          onPointerLeave={resetStagePointer}
        >
          <div className="hero-stage-glow" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--outer" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--inner" aria-hidden="true" />
          <div className="hero-orbit hero-orbit--fine" aria-hidden="true" />

          <span className="hero-orb hero-orb--orange" aria-hidden="true" />
          <span className="hero-orb hero-orb--green" aria-hidden="true" />
          <span className="hero-orb hero-orb--small" aria-hidden="true" />

          <span className="hero-floating-label hero-floating-label--top" aria-hidden="true">
            <i /> DIGITAL CRAFT / 001
          </span>
          <span className="hero-floating-label hero-floating-label--bottom" aria-hidden="true">
            BUILT WITH CURIOSITY <b>↗</b>
          </span>

          <div className="hero-laptop-wrap">
            <div className="hero-laptop">
              <div className="hero-laptop-lid">
                <div className="hero-laptop-camera" aria-hidden="true" />
                <div className="hero-laptop-screen">
                  <div className="hero-editor-toolbar">
                    <span className="hero-editor-dots"><i /><i /><i /></span>
                    <span>ayaan / portfolio.tsx</span>
                    <span className="hero-editor-status">● LIVE</span>
                  </div>
                  <div className="hero-editor-body" aria-hidden="true">
                    <div className="hero-line-numbers">
                      <span>01</span><span>02</span><span>03</span><span>04</span>
                      <span>05</span><span>06</span><span>07</span><span>08</span>
                    </div>
                    <div className="hero-code-lines">
                      <span><b>const</b> <em>build</em> = () =&gt; {"{"}</span>
                      <span className="hero-code-indent"><b>return</b> (</span>
                      <span className="hero-code-indent-two"><i>&lt;Experience</i></span>
                      <span className="hero-code-indent-three">ideas=<strong>&quot;curious&quot;</strong></span>
                      <span className="hero-code-indent-three">motion=<strong>&quot;thoughtful&quot;</strong></span>
                      <span className="hero-code-indent-two"><i>/&gt;</i></span>
                      <span className="hero-code-indent">);</span>
                      <span>{"}"}</span>
                    </div>
                  </div>
                  <div className="hero-editor-footer"><span>main</span><span>UTF-8</span><span>TypeScript JSX</span></div>
                </div>
              </div>
              <div className="hero-laptop-base"><span /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-bottomline">
        <p>BUILDING THROUGH<br />CURIOSITY & PRACTICE.</p>
        <Link href="#work" className="scroll-cue">
          <span>Scroll to explore</span>
          <ArrowDownRight size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <span className="hero-side-note">GOOD IDEAS DESERVE<br />GOOD EXECUTION.</span>
      </div>
    </section>
  );
}
