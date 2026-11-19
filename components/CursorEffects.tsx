"use client";

import { useEffect, useRef } from "react";

/** A soft, smoothly-following pointer light limited to selected visual sections. */
export function CursorEffects() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!light || !finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let targetX = -500;
    let targetY = -500;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      light.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - currentX) > 0.35 || Math.abs(targetY - currentY) > 0.35) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const moveLight = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      const zone = target?.closest<HTMLElement>("[data-spotlight-zone]");
      if (!zone) {
        light.dataset.active = "false";
        return;
      }

      const wasInactive = light.dataset.active !== "true";
      const bounds = zone.getBoundingClientRect();
      if (!bounds.width || !bounds.height) {
        hideLight();
        return;
      }
      const half = light.offsetWidth / 2;
      targetX = Math.min(Math.max(event.clientX, bounds.left + Math.min(half, bounds.width / 2)), bounds.right - Math.min(half, bounds.width / 2));
      targetY = Math.min(Math.max(event.clientY, bounds.top + Math.min(half, bounds.height / 2)), bounds.bottom - Math.min(half, bounds.height / 2));
      if (wasInactive) {
        currentX = targetX;
        currentY = targetY;
        light.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      light.dataset.active = "true";
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const hideLight = () => { light.dataset.active = "false"; };
    const onVisibilityChange = () => {
      if (document.hidden) {
        hideLight();
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    window.addEventListener("pointermove", moveLight, { passive: true });
    window.addEventListener("blur", hideLight);
    document.addEventListener("mouseleave", hideLight);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", moveLight);
      window.removeEventListener("blur", hideLight);
      document.removeEventListener("mouseleave", hideLight);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={lightRef} className="cursor-spotlight" aria-hidden="true" data-active="false" />;
}
