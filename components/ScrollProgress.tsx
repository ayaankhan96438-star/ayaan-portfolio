"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const root = document.documentElement;
        const max = Math.max(0, root.scrollHeight - window.innerHeight);
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        barRef.current?.style.setProperty("transform", `scaleX(${progress})`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="scroll-progress-track" aria-hidden="true"><div className="scroll-progress-bar" ref={barRef} /></div>;
}
