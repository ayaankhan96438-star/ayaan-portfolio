"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, CornerDownLeft, FileText, Home, Mail, Search, UserRound, X, Layers3, Code2, Milestone, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { siteConfig } from "@/lib/site";

type PaletteAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  disabledReason?: string;
  download?: boolean;
};

const actions: PaletteAction[] = [
  { id: "home", label: "Home", description: "Back to the introduction", href: "home", icon: Home },
  { id: "about", label: "About", description: "A little introduction", href: "about", icon: UserRound },
  { id: "projects", label: "Projects", description: "Selected work and case studies", href: "work", icon: Layers3 },
  { id: "skills", label: "Skills", description: "Tools of the trade", href: "playground", icon: Code2 },
  { id: "journey", label: "Journey", description: "Learning and project milestones", href: "journey", icon: Milestone },
  { id: "terminal", label: "Terminal", description: "Explore using portfolio commands", href: "terminal", icon: Terminal },
  { id: "resume", label: "Resume", description: siteConfig.resumeUrl ? "Download the resume PDF" : "No resume file has been published yet", href: siteConfig.resumeUrl, icon: FileText, disabled: !siteConfig.resumeUrl, download: true, disabledReason: "Add a real resume at public/resume.pdf and set resumeUrl in lib/site.ts to enable this action." },
  { id: "contact", label: "Contact", description: "Start a conversation", href: "contact", icon: Mail },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return actions;
    return actions.filter((action) => `${action.label} ${action.description}`.toLowerCase().includes(normalized));
  }, [query]);

  const close = useCallback(() => setOpen(false), []);

  const navigate = useCallback((action: PaletteAction) => {
    if (action.disabled || !action.href) return;
    setOpen(false);
    setQuery("");
    if (action.download) {
      const anchor = document.createElement("a");
      anchor.href = action.href;
      anchor.download = "resume.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return;
    }
    if (pathname !== "/") {
      router.push(`/#${action.href}`);
      return;
    }
    const target = document.getElementById(action.href);
    if (target) {
      window.history.replaceState(null, "", `/#${action.href}`);
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [lenis, pathname, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => filtered.length ? Math.min(filtered.length - 1, current + 1) : 0);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => filtered.length ? Math.max(0, current - 1) : 0);
      } else if (event.key === "Enter") {
        const selected = filtered[activeIndex];
        if (selected && !selected.disabled) {
          event.preventDefault();
          navigate(selected);
        }
      } else if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>(".command-palette");
        const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])');
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
      }
    };
    const onOpenRequest = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("portfolio:command-open", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("portfolio:command-open", onOpenRequest);
    };
  }, [open, close, filtered, activeIndex, navigate]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = oldOverflow;
      if (document.documentElement.dataset.intro !== "playing" && !document.getElementById("fullscreen-menu")) {
        lenis?.start();
      }
      previousFocusRef.current?.focus();
    };
  }, [open, lenis]);

  useEffect(() => setActiveIndex(0), [query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="command-palette-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
        >
          <motion.section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="command-palette-search">
              <Search size={19} aria-hidden="true" />
              <label className="sr-only" htmlFor="command-palette-input">Search portfolio sections</label>
              <input
                ref={inputRef}
                id="command-palette-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, projects, and sections..."
                autoComplete="off"
                aria-controls="command-palette-results"
                aria-activedescendant={filtered[activeIndex] ? `command-option-${filtered[activeIndex].id}` : undefined}
              />
              <kbd>ESC</kbd>
              <button type="button" className="command-palette-close" onClick={close} aria-label="Close command palette"><X size={17} /></button>
            </div>
            <div className="command-palette-heading">
              <div>
                <span className="command-palette-eyebrow">QUICK NAVIGATION</span>
                <h2 id="command-palette-title">Where to?</h2>
              </div>
              <span className="command-palette-shortcut"><Command size={12} /> K</span>
            </div>
            <div className="command-palette-results" id="command-palette-results" role="listbox" aria-label="Portfolio navigation">
              {filtered.length ? filtered.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    id={`command-option-${action.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    aria-disabled={action.disabled || undefined}
                    disabled={action.disabled}
                    className={`command-palette-option${index === activeIndex ? " is-active" : ""}${action.disabled ? " is-disabled" : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigate(action)}
                    title={action.disabled ? action.disabledReason : undefined}
                  >
                    <span className="command-option-icon"><Icon size={17} /></span>
                    <span className="command-option-copy"><strong>{action.label}</strong><small>{action.description}</small></span>
                    {action.disabled ? <span className="command-option-soon">NOT ADDED</span> : <ArrowUpRight size={16} className="command-option-arrow" />}
                  </button>
                );
              }) : <p className="command-palette-empty">No matching section. Try a different search.</p>}
            </div>
            <div className="command-palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> open section</span>
              <span><kbd>ESC</kbd> close</span>
              <span className="command-palette-footer-mark"><CornerDownLeft size={13} /> AYAAN / PORTFOLIO</span>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
