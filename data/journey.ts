export type JourneyKind = "Learning" | "Project";

export type JourneyItem = {
  id: string;
  kind: JourneyKind;
  date: string;
  title: string;
  description: string;
};

/** Keep this timeline factual and add only real, shareable milestones. */
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
];
