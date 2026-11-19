"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { ThemeArtwork } from "@/components/ThemeArtwork";
import { useLenis } from "@/components/SmoothScrollProvider";

type TerminalTone = "command" | "quiet" | "success";
type TerminalLine = { id: string; text: string; tone: TerminalTone };
type BuildFile = { name: string; code: string };

/** The only place to tune the preloader sequence. Times are in seconds. */
const TIMING = {
  readinessMaxWait: 1.6,
  hardFailsafe: 8,
  cssFailsafe: 8.5,
  shared: {
    typingFallback: 0.08,
    terminalEnterRatio: 0.85,
    workspaceLayerOffsets: { editor: 0.04, preview: 0.07, terminal: 0.1 },
    previewMotion: {
      heroWordDuration: 0.22,
      heroWordDelay: 0.04,
      heroWordStagger: 0.045,
      projectCardDuration: 0.2,
      projectCardStagger: 0.04,
    },
    responsiveMorph: { widthRatio: 0.7, durationRatio: 0.45 },
    successTextDelay: 0.02,
    expand: {
      notifyAt: 0.36,
      successFadeAt: 0.12,
      successFadeDuration: 0.13,
      coverFadeAt: 0.7,
      coverFadeDurationRatio: 0.27,
    },
  },
  desktop: {
    total: 4.45,
    workspace: { at: 0, duration: 0.38 },
    typing: { at: 0.24, charsPerSecond: 260, linePause: 0.018, fileGap: 0.04 },
    terminal: {
      command: 0.42,
      compiling: 0.78,
      ready: 1.18,
      hero: 2.12,
      projectCard: 2.5,
      responsive: 2.85,
    },
    preview: {
      navbar: { at: 1.18, duration: 0.3 },
      hero: { at: 1.5, duration: 0.42 },
      projects: { at: 2.42, duration: 0.38 },
    },
    responsive: { at: 2.9, duration: 0.4 },
    panelExit: { at: 3.28, duration: 0.32 },
    success: { at: 3.58, duration: 0.22 },
    readyGate: 3.86,
    expand: { at: 3.86, duration: 0.47 },
  },
  mobile: {
    total: 3.85,
    workspace: { at: 0, duration: 0.3 },
    typing: { at: 0.18, charsPerSecond: 300, linePause: 0.015, fileGap: 0.03 },
    terminal: {
      command: 0.34,
      compiling: 0.62,
      ready: 0.96,
      hero: 1.72,
      projectCard: 2.08,
      responsive: 2.38,
    },
    preview: {
      navbar: { at: 0.96, duration: 0.24 },
      hero: { at: 1.18, duration: 0.34 },
      projects: { at: 2.02, duration: 0.3 },
    },
    responsive: null,
    panelExit: { at: 2.42, duration: 0.3 },
    success: { at: 2.7, duration: 0.2 },
    readyGate: 2.92,
    expand: { at: 2.92, duration: 0.48 },
  },
} as const;

/** These are the only files shown in the animated editor. */
const BUILD_FILES: BuildFile[] = [
  {
    name: "HeroSection.tsx",
    code: `export function HeroSection() {\n  return <h1>Think. Code. Ship.</h1>;\n}`,
  },
  {
    name: "ProjectsSection.tsx",
    code: `export function ProjectsSection() {\n  return projects.map((project) => <ProjectCard key={project.slug} />);\n}`,
  },
  {
    name: "globals.css",
    code: `:root {\n  --bg: var(--theme-background, Canvas);\n  --text: var(--theme-text, CanvasText);\n  --accent: var(--theme-accent, AccentColor);\n}`,
  },
];

const TOKEN_PATTERN = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|<\/?[A-Za-z][\w.-]*|\/?>|@[\w-]+|\b(?:export|function|return|const|font-size|font-weight|letter-spacing|clamp|grid-template-columns|max-width)\b|\b(?:className|src|alt)\b|\b[A-Z][A-Za-z0-9_]*(?=\s*(?:\(|=)))/g;
const KEYWORDS = new Set([
  "export",
  "function",
  "return",
  "const",
  "font-size",
  "font-weight",
  "letter-spacing",
  "clamp",
  "grid-template-columns",
  "max-width",
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlightCode(source: string): string {
  let html = "";
  let lastIndex = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;
    html += escapeHtml(source.slice(lastIndex, index));

    let kind = "function";
    if (token.startsWith("/*") || token.startsWith("//")) kind = "comment";
    else if (token.startsWith("\"") || token.startsWith("'")) kind = "string";
    else if (token.startsWith("<") || token === ">" || token === "/>" || token === "?") kind = "tag";
    else if (["className", "src", "alt"].includes(token)) kind = "attribute";
    else if (KEYWORDS.has(token)) kind = "keyword";

    html += `<span class="pl-token pl-token--${kind}">${escapeHtml(token)}</span>`;
    lastIndex = index + token.length;
  }

  return html + escapeHtml(source.slice(lastIndex));
}

function createCharacterSchedule(code: string, charsPerSecond: number, linePause: number): number[] {
  let elapsed = 0;
  return Array.from(code, (character) => {
    elapsed += character === "\n" ? linePause : 1 / charsPerSecond;
    return elapsed;
  });
}

function countTypedCharacters(schedule: number[], elapsed: number): number {
  let low = 0;
  let high = schedule.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (schedule[middle] <= elapsed) low = middle + 1;
    else high = middle;
  }

  return low;
}

/** Starts after React hydration and resolves when the page is ready or the cap is reached. */
function createReadinessGate(maxWaitSeconds: number): { promise: Promise<void>; cancel: () => void } {
  let settled = false;
  let timeoutId = 0;

  const promise = new Promise<void>((resolve) => {
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };

    // Hydration has completed before this effect runs. Wait briefly for fonts,
    // but never hold the page behind the full window load or every hero image.
    timeoutId = window.setTimeout(finish, maxWaitSeconds * 1000);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) fontsReady.then(finish, finish);
    else finish();
  });

  return {
    promise,
    cancel: () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
    },
  };
}

function terminalLine(id: string, text: string, tone: TerminalTone): TerminalLine {
  return { id, text, tone };
}

export function Preloader() {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(false);
  const [activeFile, setActiveFile] = useState(BUILD_FILES[0].name);
  const [visibleCode, setVisibleCode] = useState("");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isPhone, setIsPhone] = useState(false);

  const coverRef = useRef<HTMLDivElement>(null);
  const coverInnerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLElement>(null);
  const previewPanelRef = useRef<HTMLElement>(null);
  const browserFrameRef = useRef<HTMLDivElement>(null);
  const previewNavbarRef = useRef<HTMLElement>(null);
  const previewHeroRef = useRef<HTMLElement>(null);
  const previewProjectsRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const successTextRef = useRef<HTMLDivElement>(null);
  const waitingDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;

    const rootElement = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rootElement.dataset.intro !== "playing" || reducedMotion) {
      if (reducedMotion && rootElement.dataset.intro === "playing") {
        rootElement.dataset.intro = "skip";
        window.dispatchEvent(new Event("preloader:done"));
      }
      setVisible(false);
      setActive(false);
      return;
    }

    const cover = coverRef.current;
    const coverInner = coverInnerRef.current;
    const workspace = workspaceRef.current;
    const editor = editorRef.current;
    const terminal = terminalRef.current;
    const previewPanel = previewPanelRef.current;
    const browserFrame = browserFrameRef.current;
    const success = successRef.current;
    const successText = successTextRef.current;
    const waitingDot = waitingDotRef.current;

    if (!cover || !coverInner || !workspace || !editor || !terminal || !previewPanel || !browserFrame || !success || !successText || !waitingDot) {
      setVisible(false);
      rootElement.dataset.intro = "skip";
      window.dispatchEvent(new Event("preloader:done"));
      return;
    }

    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const profile = mobile ? TIMING.mobile : TIMING.desktop;
    const readiness = createReadinessGate(TIMING.readinessMaxWait);
    let pageReady = false;
    let waitingAtGate = false;
    let notified = false;
    let completed = false;
    let disposed = false;
    let hardFailsafeId = 0;
    let context: gsap.Context | null = null;
    const timelineRef: { current: gsap.core.Timeline | null } = { current: null };

    const notifyHero = () => {
      if (notified) return;
      notified = true;
      rootElement.dataset.intro = "done";
      window.dispatchEvent(new Event("preloader:done"));
    };

    const finish = () => {
      if (completed || disposed) return;
      completed = true;
      notifyHero();

      try {
        window.sessionStorage.setItem("intro-seen", "1");
      } catch {
        // The current visit still completes if session storage is unavailable.
      }

      readiness.cancel();
      window.clearTimeout(hardFailsafeId);
      timelineRef.current?.kill();
      cover.style.touchAction = "auto";
      setActive(false);
      setVisible(false);
      lenisRef.current?.start();
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };

    const appendTerminal = (line: TerminalLine) => {
      if (disposed || completed) return;
      setTerminalLines((current) => [...current, line]);
    };

    hardFailsafeId = window.setTimeout(finish, TIMING.hardFailsafe * 1000);
    setActive(true);
    setActiveFile(BUILD_FILES[0].name);
    setVisibleCode("");
    setTerminalLines([]);
    cover.style.touchAction = "none";
    lenisRef.current?.stop();

    context = gsap.context(() => {
      gsap.set([editor, terminal, previewPanel, success], { autoAlpha: 0 });
      gsap.set(successText, { autoAlpha: 0, y: 12 });
      gsap.set(waitingDot, { autoAlpha: 0, scale: 0.75 });
      gsap.set(workspace, { autoAlpha: 0, scale: 0.99, y: 12 });
      gsap.set([previewNavbarRef.current, previewHeroRef.current, previewProjectsRef.current], { autoAlpha: 0, y: 12 });

      const timeline = gsap.timeline({ paused: true, onComplete: finish });
      // Keep the complete intro at a deliberate ~5-second pace on desktop and mobile.
      timeline.timeScale(profile.total / 5);
      timelineRef.current = timeline;
      timeline.addLabel("workspace", profile.workspace.at);
      timeline.addLabel("typing", profile.typing.at);
      timeline.addLabel("serverReady", profile.terminal.ready);
      timeline.addLabel("heroPreview", profile.preview.hero.at);
      timeline.addLabel("projectsPreview", profile.preview.projects.at);
      if (profile.responsive) timeline.addLabel("responsive", profile.responsive.at);
      timeline.addLabel("panelExit", profile.panelExit.at);
      timeline.addLabel("success", profile.success.at);
      timeline.addLabel("readyGate", profile.readyGate);
      timeline.addLabel("expand", profile.expand.at);
      timeline.addLabel("finish", profile.total);

      timeline.to(
        workspace,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: profile.workspace.duration,
          ease: "power3.out",
        },
        "workspace",
      );
      timeline.fromTo(
        editor,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: profile.workspace.duration, ease: "power3.out" },
        `workspace+=${TIMING.shared.workspaceLayerOffsets.editor}`,
      );
      timeline.fromTo(
        previewPanel,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: profile.workspace.duration, ease: "power3.out" },
        `workspace+=${TIMING.shared.workspaceLayerOffsets.preview}`,
      );
      timeline.fromTo(
        terminal,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: profile.workspace.duration * TIMING.shared.terminalEnterRatio, ease: "power3.out" },
        `workspace+=${TIMING.shared.workspaceLayerOffsets.terminal}`,
      );

      const typingSchedules = BUILD_FILES.map((file) => {
        const schedule = createCharacterSchedule(file.code, profile.typing.charsPerSecond, profile.typing.linePause);
        return { file, schedule, duration: schedule[schedule.length - 1] ?? TIMING.shared.typingFallback };
      });

      let typingPosition = profile.typing.at;
      typingSchedules.forEach(({ file, schedule, duration }) => {
        timeline.call(() => {
          setActiveFile(file.name);
          setVisibleCode("");
        }, [], typingPosition);

        const typingState = { elapsed: 0 };
        timeline.to(
          typingState,
          {
            elapsed: duration,
            duration,
            ease: "none",
            onUpdate: () => {
              if (disposed || completed) return;
              const typedCount = countTypedCharacters(schedule, typingState.elapsed);
              setVisibleCode(file.code.slice(0, typedCount));
            },
          },
          typingPosition,
        );

        typingPosition += duration + profile.typing.fileGap;
      });

      timeline.call(() => appendTerminal(terminalLine("command", "$ npm run dev", "command")), [], profile.terminal.command);
      timeline.call(() => appendTerminal(terminalLine("compiling", "Compiling components...", "quiet")), [], profile.terminal.compiling);
      timeline.call(() => {
        appendTerminal(terminalLine("server-ready", "Server ready ✓  localhost:3000", "success"));
      }, [], "serverReady");
      timeline.call(() => appendTerminal(terminalLine("hero-ready", "✓ Hero", "success")), [], profile.terminal.hero);
      timeline.call(() => appendTerminal(terminalLine("project-ready", "✓ ProjectsSection", "success")), [], profile.terminal.projectCard);
      timeline.call(() => appendTerminal(terminalLine("responsive-ready", "✓ Responsive layout ready", "success")), [], profile.terminal.responsive);

      timeline.fromTo(
        previewNavbarRef.current,
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: profile.preview.navbar.duration, ease: "power3.out" },
        "serverReady",
      );
      timeline.fromTo(
        previewHeroRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: profile.preview.hero.duration, ease: "power3.out" },
        "heroPreview",
      );
      timeline.fromTo(
        previewProjectsRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: profile.preview.projects.duration, ease: "power3.out" },
        "projectsPreview",
      );

      const heroWords = Array.from(cover.querySelectorAll<HTMLElement>(".pl-preview-title > span"));
      heroWords.forEach((word, index) => {
        timeline.fromTo(
          word,
          { y: 18, autoAlpha: 0.35 },
          {
            y: 0,
            autoAlpha: 1,
            duration: TIMING.shared.previewMotion.heroWordDuration,
            ease: "power3.out",
          },
          profile.preview.hero.at + TIMING.shared.previewMotion.heroWordDelay + index * TIMING.shared.previewMotion.heroWordStagger,
        );
      });

      const previewCards = Array.from(cover.querySelectorAll<HTMLElement>(".pl-preview-card"));
      previewCards.forEach((card, index) => {
        timeline.fromTo(
          card,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: TIMING.shared.previewMotion.projectCardDuration,
            ease: "power3.out",
          },
          profile.preview.projects.at + index * TIMING.shared.previewMotion.projectCardStagger,
        );
      });

      if (profile.responsive) {
        const browserWidth = browserFrame.getBoundingClientRect().width;
        timeline.to(browserFrame, {
          width: browserWidth * TIMING.shared.responsiveMorph.widthRatio,
          duration: profile.responsive.duration * TIMING.shared.responsiveMorph.durationRatio,
          ease: "power2.inOut",
        }, "responsive");
        timeline.to(browserFrame, {
          width: browserWidth,
          duration: profile.responsive.duration * (1 - TIMING.shared.responsiveMorph.durationRatio),
          ease: "power2.inOut",
          onComplete: () => gsap.set(browserFrame, { clearProps: "width" }),
        }, `responsive+=${profile.responsive.duration * TIMING.shared.responsiveMorph.durationRatio}`);
      }

      timeline.to(editor, {
        x: -24,
        autoAlpha: 0,
        duration: profile.panelExit.duration,
        ease: "power2.in",
      }, "panelExit");
      timeline.to(terminal, {
        x: -12,
        autoAlpha: 0,
        duration: profile.panelExit.duration,
        ease: "power2.in",
      }, "panelExit");
      timeline.fromTo(
        success,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: profile.success.duration, ease: "power2.out" },
        "success",
      );
      timeline.to(successText, {
        autoAlpha: 1,
        y: 0,
        duration: profile.success.duration,
        ease: "power3.out",
      }, `success+=${TIMING.shared.successTextDelay}`);

      const previewBounds = previewPanel.getBoundingClientRect();
      const insetTop = Math.max(0, previewBounds.top);
      const insetRight = Math.max(0, window.innerWidth - previewBounds.right);
      const insetBottom = Math.max(0, window.innerHeight - previewBounds.bottom);
      const insetLeft = Math.max(0, previewBounds.left);
      const startingClip = `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 14px)`;

      timeline.set(workspace, { transform: "none" }, "expand");
      timeline.set(browserFrame, { clearProps: "width" }, "expand");
      timeline.set(previewPanel, {
        position: "fixed",
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        margin: 0,
        zIndex: 10002,
        clipPath: startingClip,
      }, "expand");
      timeline.to(previewPanel, {
        clipPath: "inset(0px 0px 0px 0px round 0px)",
        duration: profile.expand.duration,
        ease: "power3.inOut",
      }, "expand");
      timeline.call(
        notifyHero,
        [],
        profile.expand.at + profile.expand.duration * TIMING.shared.expand.notifyAt,
      );
      timeline.to(success, {
        autoAlpha: 0,
        duration: TIMING.shared.expand.successFadeDuration,
        ease: "power1.out",
      }, profile.expand.at + profile.expand.duration * TIMING.shared.expand.successFadeAt);
      timeline.to(coverInner, {
        autoAlpha: 0,
        duration: profile.expand.duration * TIMING.shared.expand.coverFadeDurationRatio,
        ease: "power1.out",
      }, profile.expand.at + profile.expand.duration * TIMING.shared.expand.coverFadeAt);

      timeline.addPause("readyGate", () => {
        if (pageReady) {
          timeline.play();
          return;
        }

        waitingAtGate = true;
        gsap.set(successText, { autoAlpha: 0 });
        gsap.set(waitingDot, { autoAlpha: 1, scale: 1 });
      });
    }, cover);

    // This effect runs only after the client tree has hydrated.
    timelineRef.current?.play(0);

    readiness.promise.then(() => {
      if (completed || disposed) return;
      pageReady = true;
      if (!waitingAtGate) return;

      waitingAtGate = false;
      gsap.set(waitingDot, { autoAlpha: 0 });
      gsap.set(successText, { autoAlpha: 1, y: 0 });
      timelineRef.current?.play();
    });

    return () => {
      disposed = true;
      window.clearTimeout(hardFailsafeId);
      readiness.cancel();
      timelineRef.current?.kill();
      context?.revert();
      cover.style.touchAction = "auto";
      if (!completed && rootElement.dataset.intro === "playing") {
        lenisRef.current?.start();
      }
    };
  }, [visible]);

  useEffect(() => {
    if (!lenis) return;
    if (active && visible) lenis.stop();
    else if (document.documentElement.dataset.intro !== "playing") lenis.start();
    else lenis.stop();
  }, [active, lenis, visible]);

  useEffect(() => {
    if (!visible) return;
    const media = window.matchMedia("(max-width: 639px)");
    const syncPhoneLayout = () => setIsPhone(media.matches);
    syncPhoneLayout();
    media.addEventListener("change", syncPhoneLayout);
    return () => media.removeEventListener("change", syncPhoneLayout);
  }, [visible]);

  if (!visible) return null;

  const codeLines = visibleCode.split("\n");
  const visibleLines = isPhone ? codeLines.slice(-5) : codeLines;
  const displayCode = visibleLines.join("\n");
  const firstVisibleLine = Math.max(1, codeLines.length - visibleLines.length + 1);
  const lineNumbers = Array.from({ length: Math.max(1, visibleLines.length) }, (_, index) => firstVisibleLine + index);

  return (
    <>
      <div
        className="pl-cover"
        ref={coverRef}
        aria-hidden="true"
        style={{ animationDuration: `${TIMING.cssFailsafe}s` }}
      >
        <div className="pl-cover-inner" ref={coverInnerRef}>
          <header className="pl-topline">
            <span className="pl-brand">ayaan<span>.</span></span>
            <span className="pl-topline-meta">INDEPENDENT DEVELOPER / PORTFOLIO 2026</span>
            <span className="pl-live-status"><i /> LIVE BUILD</span>
          </header>

          <div className="pl-workspace" ref={workspaceRef}>
            <section className="pl-panel pl-editor-panel" ref={editorRef} aria-label="Code editor">
              <div className="pl-code-tabs" aria-label="Open files">
                {BUILD_FILES.map((file) => (
                  <span className={activeFile === file.name ? "is-active" : ""} key={file.name}>
                    {file.name}
                  </span>
                ))}
              </div>
              <div className="pl-editor-body">
                <div className="pl-code-window">
                  <pre className="pl-line-numbers">
                    {lineNumbers.map((line) => <span key={line}>{line}</span>)}
                  </pre>
                  <pre className="pl-code-text">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(displayCode) }} />
                    <i className="pl-code-cursor" />
                  </pre>
                </div>
              </div>
            </section>

            <section className="pl-panel pl-terminal-panel" ref={terminalRef} aria-label="Build terminal">
              <div className="pl-terminal-lines">
                {terminalLines.map((line) => (
                  <div className={`pl-terminal-line pl-terminal-line--${line.tone}`} key={line.id}>
                    {line.text}
                  </div>
                ))}
              </div>
            </section>

            <section className="pl-preview-panel" ref={previewPanelRef} aria-label="Portfolio preview">
              <div className="pl-browser-frame" ref={browserFrameRef}>
                <div className="pl-browser-bar">
                  <span className="pl-window-dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="pl-browser-address">localhost:3000</span>
                  <span className="pl-browser-refresh" aria-hidden="true">↻</span>
                </div>

                <div className="pl-preview-page">
                  <header className="pl-preview-nav" ref={previewNavbarRef}>
                    <span className="pl-preview-brand">ayaan<span>.</span></span>
                    <div className="pl-preview-nav-actions">
                      <span className="pl-availability"><i />Available for work</span>
                      <span className="pl-menu-button">Menu <i><b /><b /></i></span>
                    </div>
                  </header>

                  <section className="pl-preview-hero" ref={previewHeroRef}>
                    <h1 className="pl-preview-title">
                      <span>Think.</span>
                      <span>Code.</span>
                      <span>Ship<span className="pl-preview-accent-dot">.</span></span>
                    </h1>
                    <p>Turning complicated ideas into simple digital things.</p>
                  </section>

                  <section className="pl-preview-projects" ref={previewProjectsRef}>
                    <div className="pl-preview-project-heading">
                      <h2>Selected work</h2>
                      <span aria-hidden="true" />
                    </div>
                    <div className="pl-preview-grid">
                      {projects.slice(0, 3).map((project) => (
                        <article className="pl-preview-card" key={project.slug}>
                          <div className="pl-preview-card-image">
                            <ThemeArtwork src={project.image} alt={project.imageAlt} />
                          </div>
                          <div className="pl-preview-card-copy">
                            <h3>{project.title}</h3>
                            <div className="pl-preview-tags">
                              {project.stack.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </section>
          </div>

          <div className="pl-success" ref={successRef}>
            <div className="pl-success-content" ref={successTextRef}>
              <p>BUILD SUCCESSFUL <span>✓</span></p>
              <h2>BUILT WITH CODE<span>.</span></h2>
            </div>
            <span className="pl-waiting-dot" ref={waitingDotRef} aria-hidden="true" />
          </div>
        </div>
      </div>
      <span className="pl-visually-hidden" role="status">Loading portfolio</span>
    </>
  );
}
