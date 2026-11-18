"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const introLines = [
  "I'm Ayaan Khan — a software developer who likes",
  "turning big ideas into clean, useful,",
  "and occasionally over-engineered things.",
];

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".intro-reveal-line", {
        yPercent: 110,
        opacity: 0.3,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".intro-statement",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".intro-detail", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".intro-details",
          start: "top 88%",
          once: true,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section className="section intro-section" id="about" ref={sectionRef}>
      <div className="section-heading">
        <span className="section-number">01</span>
        <h2>Hello<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">A LITTLE INTRODUCTION</span>
      </div>

      <div className="intro-content">
        <p className="intro-statement">
          {introLines.map((line) => (
            <span className="intro-line-mask" key={line}>
              <span className="intro-reveal-line">{line}</span>
            </span>
          ))}
        </p>
        <div className="intro-details">
          <p className="intro-detail">I enjoy the whole process: understanding the problem, shaping the interface, writing the code, and making the last 5% feel right.</p>
          <p className="intro-detail">Lately, that means building web apps, playful interfaces, and small products that solve real problems. Less buzzword bingo. More things that work.</p>
          <span className="intro-signoff intro-detail">NICE TO MEET YOU <span>↘</span></span>
        </div>
      </div>
    </section>
  );
}
