export type SkillGroup = {
  number: string;
  title: string;
  description: string;
  skills: string[];
  note?: string;
};

/** Edit this file to keep the skills shown on the site and in the terminal in sync. */
export const skillGroups: SkillGroup[] = [
  {
    number: "01",
    title: "Frontend",
    description: "Interfaces that feel clear, quick and considered.",
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    number: "02",
    title: "Backend",
    description: "Application logic, APIs and server-side workflows.",
    skills: ["Node.js", "REST APIs", "Prisma", "Vite", "API Integration"],
  },
  {
    number: "03",
    title: "Databases",
    description: "Working with structured data and persistence.",
    skills: ["PostgreSQL", "SQL", "Prisma ORM", "MongoDB"],
    note: "MongoDB · currently learning",
  },
  {
    number: "04",
    title: "Programming & Tools",
    description: "The languages and tools behind the build.",
    skills: ["JavaScript", "TypeScript", "Python", "Bash", "Git", "GitHub", "Linux / Kali", "GSAP", "Framer Motion"],
  },
];
