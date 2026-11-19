export type JourneyKind = "Learning" | "Project" | "Experience" | "Achievement";

export type JourneyItem = {
  id: string;
  kind: JourneyKind;
  date: string;
  title: string;
  description: string;
  placeholder?: boolean;
};

/**
 * Keep this timeline factual. Replace the editable placeholder entries with
 * verified dates, roles, certifications or achievements as they happen.
 */
export const journeyItems: JourneyItem[] = [
  {
    id: "learning-now",
    kind: "Learning",
    date: "CURRENT",
    title: "Learning by building",
    description: "Exploring web development and cybersecurity while strengthening practical skills through personal projects and hands-on practice.",
  },
  {
    id: "amaantrader-2026",
    kind: "Project",
    date: "2026",
    title: "AmaanTrader",
    description: "Built the interface and shopping experience for a jacket and outerwear storefront concept.",
  },
  {
    id: "book-exchange-2026",
    kind: "Project",
    date: "2026",
    title: "Book Exchange",
    description: "Developed a full-stack book exchange platform concept focused on catalogue discovery and book details.",
  },
  {
    id: "experience-placeholder",
    kind: "Experience",
    date: "ADD DATE",
    title: "Add a verified experience",
    description: "Add an internship, role, volunteer position or other real experience here when you are ready to share it.",
    placeholder: true,
  },
  {
    id: "achievement-placeholder",
    kind: "Achievement",
    date: "ADD DATE",
    title: "Add a verified achievement",
    description: "Add a certification, award, completed course or meaningful milestone here after it has been earned.",
    placeholder: true,
  },
];
