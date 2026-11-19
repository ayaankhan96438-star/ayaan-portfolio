"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowUpRight, Terminal as TerminalIcon } from "lucide-react";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { siteConfig } from "@/lib/site";
import { useLenis } from "@/components/SmoothScrollProvider";

type TerminalEntry = { id: number; command: string; lines: string[] };

const helpLines = [
  "Available commands:",
  "  help      Show this command list",
  "  about     A short introduction",
  "  projects  Explore the projects section",
  "  skills    View the current technology stack",
  "  contact   Jump to contact details",
  "  clear     Clear the terminal output",
];

export function DeveloperTerminal() {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: 0, command: "welcome", lines: ["Ayaan Khan · Portfolio Terminal", "A small, simulated interface for exploring this portfolio.", "Type 'help' to see what you can do."] },
  ]);
  const [nextId, setNextId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const skillsText = useMemo(() => skillGroups.map((group) => `${group.title}: ${group.skills.join(", ")}`).join("\n"), []);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries]);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target && lenis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };

  const runCommand = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    setHistory((current) => [...current, raw.trim()]);
    setHistoryIndex(-1);
    setValue("");

    if (command === "clear") {
      setEntries([]);
      return;
    }

    let lines: string[];
    switch (command) {
      case "help":
        lines = helpLines;
        break;
      case "about":
        lines = [
          "Ayaan Khan — student developer.",
          "Exploring web development and cybersecurity while learning by building practical projects.",
          "Jumping to the introduction section...",
        ];
        scrollTo("about");
        break;
      case "projects":
        lines = ["Selected projects:", ...projects.map((project) => `  ${project.number}. ${project.title} — ${project.shortDescription}`), "Opening the project showcase..."];
        scrollTo("work");
        break;
      case "skills":
        lines = ["Current stack:", ...skillsText.split("\n"), "Opening the skills section..."];
        scrollTo("playground");
        break;
      case "contact":
        lines = [`Email: ${siteConfig.email}`, `GitHub: ${siteConfig.github}`, `LinkedIn: ${siteConfig.linkedin}`, "Opening the contact section..."];
        scrollTo("contact");
        break;
      default:
        lines = [`Command not found: ${command}`, "This is a portfolio-only simulation, not a system shell.", "Type 'help' to see supported commands."];
    }

    setEntries((current) => [...current, { id: nextId, command: raw.trim(), lines }]);
    setNextId((current) => current + 1);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex] ?? "");
      }
    }
  };

  return (
    <section className="section terminal-section" id="terminal" data-spotlight-zone aria-labelledby="terminal-title">
      <div className="section-heading" data-cinematic-reveal>
        <span className="section-number">05</span>
        <h2 id="terminal-title">A little command line<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">PORTFOLIO TERMINAL / SIMULATED</span>
      </div>

      <div className="terminal-shell" data-cinematic-reveal>
        <div className="terminal-topbar">
          <span className="terminal-window-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="terminal-window-title"><TerminalIcon size={13} /> ayaan@portfolio:~</span>
          <span className="terminal-status"><i /> LOCAL SESSION</span>
        </div>
        <div className="terminal-output" ref={outputRef} role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              {entry.command !== "welcome" ? <p className="terminal-command"><span>ayaan@portfolio:~$</span> {entry.command}</p> : null}
              {entry.lines.map((line, index) => <p className="terminal-line" key={`${entry.id}-${index}`}>{line}</p>)}
            </div>
          ))}
        </div>
        <form className="terminal-input-row" onSubmit={onSubmit}>
          <label className="terminal-prompt" htmlFor="portfolio-terminal-input">ayaan@portfolio:~$</label>
          <input
            ref={inputRef}
            id="portfolio-terminal-input"
            className="terminal-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Enter a portfolio terminal command"
            placeholder="type a command..."
          />
          <button className="terminal-submit" type="submit" aria-label="Run command"><ArrowUpRight size={16} /></button>
        </form>
        <div className="terminal-hint"><span>TIP: USE ↑ / ↓ FOR COMMAND HISTORY</span><span>NO SYSTEM COMMANDS ARE EXECUTED</span></div>
      </div>
    </section>
  );
}
