export type Project = {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  overview: string;
  image: string;
  imageAlt: string;
  category: string;
  year: string;
  role: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  challenge: string;
  approach: string;
  highlights: string[];
  result: string;
};

/**
 * Project links and verified technology stacks for Ayaan Khan's portfolio.
 * Optional links are omitted when no confirmed URL is available.
 */
export const projects: Project[] = [
  {
    slug: "amaantrader",
    number: "01",
    title: "AmaanTrader",
    shortDescription: "A sharper storefront for outerwear, built to make browsing feel like an experience.",
    overview:
      "A premium jacket and outerwear shopping concept with a cinematic first impression, clear product storytelling, and useful shopping interactions.",
    image: "/images/project-amaantrader.svg",
    imageAlt: "Editorial outerwear storefront mockup with a jacket product card",
    category: "E-COMMERCE",
    year: "2026",
    role: "UI design · Front-end development",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Motion", "React Router", "Lucide React", "Recharts", "Node.js API"],
    liveUrl: "https://ayaankhan96438-star.github.io/AMAANTRADERS/",
    githubUrl: "https://github.com/ayaankhan96438-star/AMAANTRADERS",
    challenge:
      "Give a product-led store a premium feel while keeping the basics effortless: discover a jacket, understand the details, choose a size, and move toward checkout.",
    approach:
      "The direction pairs editorial typography with restrained colors, large product imagery, and small moments of interaction. Product content stays data-driven so the catalogue can grow without rebuilding the layout.",
    highlights: [
      "Cinematic hero and editorial product storytelling",
      "Collection, category, and product detail layouts",
      "Product image gallery and size selection states",
      "Responsive navigation and shopping information pages",
    ],
    result:
      "A more considered shopping experience that treats outerwear like the hero product, not just another grid item.",
  },
  {
    slug: "royal-realms-chess",
    number: "02",
    title: "Royal Realms Chess",
    shortDescription: "A chess game with a little more personality than the usual 64 squares.",
    overview:
      "An offline-first chess experience built around expressive board themes, distinct piece styling, and opponents that scale from a casual warm-up to a serious challenge.",
    image: "/images/project-chess.svg",
    imageAlt: "Abstract dark chessboard with neon green pieces and a minimal game interface",
    category: "INTERACTIVE PRODUCT",
    year: "2026",
    role: "Product design · Front-end development",
    stack: ["Vite", "chess.js", "Stockfish"],
    githubUrl: "https://github.com/ayaankhan96438-star/royal-realms-chess",
    challenge:
      "Make a familiar game feel personal without getting in the way of the game itself. The interface needed to stay readable, responsive, and usable without an internet connection.",
    approach:
      "I built the experience around a clean game surface, selectable visual themes, and a modular opponent setup. Chess rules are handled by chess.js, while the engine integration provides stronger computer play.",
    highlights: [
      "Selectable board worlds with live previews",
      "Offline-friendly gameplay and local assets",
      "Difficulty modes powered by a chess engine",
      "Responsive layout for laptop and smaller screens",
    ],
    result:
      "A focused chess playground where the board is the star, with enough customization to make repeat games feel fresh.",
  },
  {
    slug: "book-exchange",
    number: "03",
    title: "Book Exchange",
    shortDescription: "A small, community-minded home for passing good non-fiction books along.",
    overview:
      "A book exchange platform concept for a home-run non-fiction book community, designed around discovery, useful book details, and a straightforward exchange journey.",
    image: "/images/project-books.svg",
    imageAlt: "Warm editorial library interface with colorful non-fiction book covers",
    category: "FULL-STACK WEB APP",
    year: "2026",
    role: "Full-stack development",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Prisma", "PostgreSQL", "Cloudinary", "lucide-react"],
    liveUrl: "https://bookexchange.store/",
    githubUrl: "https://github.com/ayaankhan96438-star/book-exchange",
    challenge:
      "Turn a simple book exchange idea into a clear digital flow without losing the friendly, local character of the project.",
    approach:
      "I used the Next.js App Router for the application structure, Prisma for data access, and reusable UI patterns to keep catalogue and book detail pages consistent.",
    highlights: [
      "Book catalogue with reusable listing components",
      "Structured data model for book information",
      "Responsive layouts for discovery on any screen",
      "A foundation for community-led exchange workflows",
    ],
    result:
      "A practical starting point for a focused book exchange, with a clear catalogue experience and room to grow.",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
