"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { useLenis } from "@/components/SmoothScrollProvider";

const menuItems = [
  { label: "Home", href: "/#home", number: "01" },
  { label: "About", href: "/#about", number: "02" },
  { label: "Selected work", href: "/#work", number: "03" },
  { label: "Contact", href: "/#contact", number: "04" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();
  const [localTime, setLocalTime] = useState("--:--");
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (menuOpen || document.documentElement.dataset.intro === "playing") {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [lenis, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const menuTrigger = menuTriggerRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => firstMenuLinkRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const overlay = document.getElementById("fullscreen-menu");
      const focusable = overlay?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      (menuTrigger ?? previouslyFocused)?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-nav">
        <Link className="nav-logo" href="/#home" aria-label="Ayaan Khan home">
          ayaan<span className="logo-period">.</span>
        </Link>

        <div className="nav-meta">
          <span className="availability"><span className="availability-dot" /> Available for work</span>
          <span className="nav-time"><span className="nav-time-label">LOCAL TIME</span> {localTime}</span>
        </div>

        <button
          type="button"
          className="menu-trigger"
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu"
          onClick={() => setMenuOpen(true)}
          ref={menuTriggerRef}
        >
          Menu <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="fullscreen-menu"
            className="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-overlay-top">
              <Link href="/#home" className="nav-logo" onClick={() => setMenuOpen(false)}>
                ayaan<span className="logo-period">.</span>
              </Link>
              <button type="button" className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                Close <X size={19} strokeWidth={1.6} />
              </button>
            </div>

            <nav className="menu-links" aria-label="Main navigation">
              {menuItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.number}
                  onClick={() => setMenuOpen(false)}
                  ref={item.number === "01" ? firstMenuLinkRef : undefined}
                >
                  <span className="menu-number">{item.number}</span>
                  <span>{item.label}</span>
                  <ArrowUpRight className="menu-arrow" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            <div className="menu-bottom">
              <div>
                <span className="eyebrow">HAVE A GOOD ONE IN MIND?</span>
                {siteConfig.email ? (
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                ) : siteConfig.github ? (
                  <a href={siteConfig.github} target="_blank" rel="noreferrer">Find me on GitHub</a>
                ) : null}
              </div>
              <span className="menu-time">LOCAL TIME · {localTime}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
