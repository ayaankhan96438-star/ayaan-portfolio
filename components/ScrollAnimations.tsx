"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Progressive-enhancement scroll reveals. Content stays visible if motion JS is unavailable. */
export function ScrollAnimations() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // Grouped cards enter together with a restrained stagger instead of popping in individually.
      gsap.utils.toArray<HTMLElement>("[data-cinematic-stagger]").forEach((group) => {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-cinematic-item]"));
        if (!items.length) return;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 30, rotateX: 2.5, filter: "blur(5px)" },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.78,
            stagger: 0.11,
            ease: "power3.out",
            clearProps: "filter,transform,opacity,visibility",
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          },
        );
      });

      // Individual headings, supporting copy and interactive panels use a softer reveal.
      gsap.utils
        .toArray<HTMLElement>("[data-cinematic-reveal]:not([data-cinematic-item])")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 24, filter: "blur(4px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.72,
              ease: "power3.out",
              clearProps: "filter,transform,opacity,visibility",
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
            },
          );
        });
    });

    // Wait until the page has laid out before measuring reveal triggers.
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [pathname]);

  return null;
}
