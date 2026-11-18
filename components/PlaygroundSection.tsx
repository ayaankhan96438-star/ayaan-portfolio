"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Atom, Braces, Code2, Database, Layers3, Terminal, Wind, Zap } from "lucide-react";

type Position = { x: number; y: number; rotate: number };

const techStack = [
  { name: "React", note: "UI", icon: Atom, className: "tech-react" },
  { name: "Next.js", note: "FRAMEWORK", icon: Layers3, className: "tech-next" },
  { name: "TypeScript", note: "TYPES", icon: Braces, className: "tech-typescript" },
  { name: "Node.js", note: "RUNTIME", icon: Terminal, className: "tech-node" },
  { name: "Tailwind", note: "CSS", icon: Wind, className: "tech-tailwind" },
  { name: "GSAP", note: "MOTION", icon: Zap, className: "tech-gsap" },
  { name: "Postgres", note: "DATA", icon: Database, className: "tech-postgres" },
  { name: "JavaScript", note: "LOGIC", icon: Code2, className: "tech-js" },
];

const cleanPositions: Position[] = [-3, 2, -1, 3, 2, -2, 1, -3].map((rotate) => ({ x: 0, y: 0, rotate }));

export function PlaygroundSection() {
  const playgroundRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Position[]>(cleanPositions);
  const [resetKey, setResetKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const scatter = () => {
    const bounds = playgroundRef.current?.getBoundingClientRect();
    const spreadX = Math.min(120, (bounds?.width ?? 800) * 0.12);
    const spreadY = Math.min(85, (bounds?.height ?? 300) * 0.2);
    setPositions(techStack.map(() => ({
      x: Math.round((Math.random() * 2 - 1) * spreadX),
      y: Math.round((Math.random() * 2 - 1) * spreadY),
      rotate: Math.round((Math.random() * 2 - 1) * 24),
    })));
  };

  const reset = () => {
    setPositions(cleanPositions.map((position) => ({ ...position })));
    setResetKey((current) => current + 1);
  };

  return (
    <section className="section playground-section" id="playground">
      <div className="section-heading">
        <span className="section-number">03</span>
        <h2>The fun part<span className="accent-dot">.</span></h2>
        <span className="section-heading-note">A VERY SCIENTIFIC SKILLS TEST</span>
      </div>

      <div className="playground-intro">
        <h3>I sweat the details.<br /><span>Your turn, drag something.</span></h3>
        <p>These are a few of the tools I reach for. They behave better than I do before coffee.</p>
      </div>

      <div className="tech-playground" ref={playgroundRef} role="group" aria-label="Draggable technology skills">
        {techStack.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={`${item.name}-${resetKey}`}
              className={`tech-chip ${item.className}`}
              role="group"
              tabIndex={0}
              aria-roledescription="draggable technology badge"
              aria-label={`${item.name}. Use arrow keys to move, Home to reset.`}
              onKeyDown={(event) => {
                const step = event.shiftKey ? 30 : 12;
                if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                  setPositions((current) => current.map((position, positionIndex) => positionIndex !== index ? position : {
                    ...position,
                    x: position.x + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0),
                    y: position.y + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0),
                  }));
                } else if (event.key === "Home") {
                  event.preventDefault();
                  setPositions((current) => current.map((position, positionIndex) => positionIndex === index ? { ...cleanPositions[index] } : position));
                }
              }}
              drag
              dragConstraints={playgroundRef}
              dragMomentum
              dragElastic={0.82}
              dragTransition={{ bounceStiffness: 330, bounceDamping: 13 }}
              animate={positions[index]}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 165, damping: 13, mass: 0.8 }}
              whileDrag={{ scale: shouldReduceMotion ? 1 : 1.08, zIndex: 20, cursor: "grabbing" }}
            >
              <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              <span className="tech-chip-name">{item.name}</span>
              <span className="tech-chip-note">{item.note}</span>
              <span className="sr-only">Drag with a pointer or touch, or use the arrow keys to move this badge. Press Home to reset it.</span>
            </motion.div>
          );
        })}
      </div>

      <div className="playground-controls">
        <span>GO ON. THEY&apos;RE DRAGGABLE.</span>
        <div className="playground-buttons">
          <button type="button" className="button button-dark" onClick={scatter}>Mess it up <span>↗</span></button>
          <button type="button" className="button button-light" onClick={reset}>Reset <span>↺</span></button>
        </div>
      </div>
    </section>
  );
}
