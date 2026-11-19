"use client";

import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { BrowserWindow } from "@/components/BrowserWindow";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stripImages = [
  { src: "/images/hero-interface.svg", alt: "Abstract interface dashboard artwork" },
  { src: "/images/photo1.png", alt: "AmaanTrader jacket project photograph" },
  { src: "/images/photo2.png", alt: "Book Exchange project photograph" },
];

function ImageStrip({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const images = reverse ? [...stripImages].reverse() : stripImages;
  return (
    <span className={`hero-strip ${className}`} aria-hidden="true">
      <span className="hero-strip-track">
        {[...images, ...images].map((image, index) => (
          <span className="hero-strip-image" key={`${image.src}-${index}`}>
            <BrowserWindow
              src={image.src}
              alt={image.alt}
              sizes="(max-width: 640px) 46vw, 34vw"
              compact
              priority={index < 3}
              address="Ayaan Khan / Selected work"
            />
          </span>
        ))}
      </span>
    </span>
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revealTimeline: gsap.core.Timeline | null = null;
    const context = gsap.context(() => {
      revealTimeline = gsap.timeline({ paused: true });
      revealTimeline.fromTo(
        ".hero-word-inner",
        { yPercent: 115, rotate: 2, opacity: 0.2 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.16,
          ease: "power4.out",
          clearProps: "transform,opacity",
        },
      );

      gsap.to(".hero-strip--one .hero-strip-track", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".hero-strip--two .hero-strip-track", {
        xPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.to(".hero-copy", {
        y: 70,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
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
    <section className="hero-section" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">SOFTWARE DEVELOPER · DIGITAL CRAFT</span>
        <span className="hero-index">INDEPENDENTLY BUILT / ALWAYS ITERATING</span>
      </div>

      <div className="hero-copy">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-word-mask"><span className="hero-word-inner">Think<span className="hero-dot">.</span></span></span>
          <ImageStrip className="hero-strip--one" />
          <span className="hero-word-mask"><span className="hero-word-inner">Code<span className="hero-dot">.</span></span></span>
          <ImageStrip reverse className="hero-strip--two" />
          <span className="hero-word-mask"><span className="hero-word-inner">Ship<span className="hero-dot">.</span></span></span>
        </h1>
      </div>

      <div className="hero-bottomline">
        <p>Turning complicated ideas<br />into simple digital things.</p>
        <Link href="#work" className="scroll-cue">
          <span>Scroll to explore</span>
          <ArrowDownRight size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <span className="hero-side-note">GOOD IDEAS DESERVE<br />GOOD EXECUTION.</span>
      </div>
    </section>
  );
}
