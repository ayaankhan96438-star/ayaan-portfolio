"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    const onScroll = () => ScrollTrigger.update();
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    let observer: MutationObserver | null = null;
    let frame = 0;

    const scrollToHashTarget = () => {
      if (!hash) return false;

      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);
      if (!target) return false;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { immediate: true });
      } else {
        target.scrollIntoView();
      }

      ScrollTrigger.refresh();
      observer?.disconnect();
      return true;
    };

    if (hash) {
      observer = new MutationObserver(scrollToHashTarget);
      observer.observe(document.body, { childList: true, subtree: true });
      frame = window.requestAnimationFrame(scrollToHashTarget);
    } else {
      frame = window.requestAnimationFrame(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        ScrollTrigger.refresh();
      });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}
