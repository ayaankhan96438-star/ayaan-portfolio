"use client";

import { useEffect, useRef } from "react";

/** A low-key ambient pointer light for mouse / trackpad users. */
export function CursorEffects() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!light || !finePointer.matches || reducedMotion.matches) return;

    const moveLight = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      light.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      light.dataset.active = "true";
    };

    const hideLight = () => {
      if (light) light.dataset.active = "false";
    };

    window.addEventListener("pointermove", moveLight, { passive: true });
    window.addEventListener("blur", hideLight);
    document.addEventListener("mouseleave", hideLight);

    return () => {
      window.removeEventListener("pointermove", moveLight);
      window.removeEventListener("blur", hideLight);
      document.removeEventListener("mouseleave", hideLight);
    };
  }, []);

  return <div ref={lightRef} className="cursor-spotlight" aria-hidden="true" data-active="false" />;
}
