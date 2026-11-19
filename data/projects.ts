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
    image: "/images/photo1.png",
    imageAlt: "AmaanTrader storefront homepage featuring a navy varsity jacket in the outerwear collection",
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
    slug: "book-exchange",
    number: "02",
    title: "Book Exchange",
    shortDescription: "A small, community-minded home for passing good non-fiction books along.",
    overview:
      "A book exchange platform concept for a home-run non-fiction book community, designed around discovery, useful book details, and a straightforward exchange journey.",
    image: "/images/photo2.png",
    imageAlt: "Book Exchange homepage preview with a non-fiction book exchange message and stacked-book illustration",
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
