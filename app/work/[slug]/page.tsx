import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/data/projects";
import { BrowserWindow } from "@/components/BrowserWindow";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Ayaan Khan`,
      description: project.shortDescription,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ayaan Khan — Software Developer" }],
    },
  };
}

export default async function ProjectCaseStudy({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main>
      <article className="case-study">
      <div className="case-back-row">
        <Link href="/#work" className="text-link"><ArrowLeft size={16} /> Back to selected work</Link>
        <span>CASE STUDY / {project.number}</span>
      </div>

      <header className="case-hero">
        <div className="case-meta-line"><span>{project.category}</span><span>{project.year}</span></div>
        <h1>{project.title}<span className="accent-dot">.</span></h1>
        <p>{project.overview}</p>
        <div className="case-hero-image">
          <BrowserWindow
            src={project.image}
            alt={project.imageAlt}
            sizes="(max-width: 760px) 100vw, 90vw"
            priority
            address={project.liveUrl || "Local project preview"}
          />
        </div>
      </header>

      <div className="case-facts">
        <div><span>MY ROLE</span><p>{project.role}</p></div>
        <div><span>STACK</span><p>{project.stack.length ? project.stack.join(" · ") : "Not specified"}</p></div>
        <div><span>YEAR</span><p>{project.year}</p></div>
      </div>

      <div className="case-content">
        <section className="case-copy-block">
          <span className="case-kicker">01 / THE CHALLENGE</span>
          <h2>Start with<br />the problem.</h2>
          <p>{project.challenge}</p>
        </section>
        <section className="case-copy-block">
          <span className="case-kicker">02 / THE APPROACH</span>
          <h2>Make it make<br />sense.</h2>
          <p>{project.approach}</p>
        </section>
        <section className="case-highlights">
          <span className="case-kicker">03 / THE DETAILS</span>
          <h2>The good bits<span className="accent-dot">.</span></h2>
          <ul>
            {project.highlights.map((highlight) => <li key={highlight}>{highlight}<ArrowUpRight size={17} /></li>)}
          </ul>
        </section>
        <section className="case-copy-block case-result">
          <span className="case-kicker">04 / THE OUTCOME</span>
          <h2>And then<br />it shipped.</h2>
          <p>{project.result}</p>
        </section>
      </div>

      <div className="case-actions">
        <div>
          <span className="eyebrow">WANT TO SEE THE BUILD?</span>
          <p>Take a closer look at the code or get in touch to talk through the details.</p>
        </div>
        <div className="case-action-links">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button button-dark">Live project <ExternalLink size={16} /></a>
          ) : null}
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="button button-light">GitHub <ArrowUpRight size={16} /></a>
          ) : null}
        </div>
      </div>

      <div className="next-project-row">
        <Link href="/#work" className="text-link">Explore more projects <ArrowUpRight size={16} /></Link>
        <Link href="/#contact" className="text-link">Have an idea? Let&apos;s talk <ArrowUpRight size={16} /></Link>
      </div>
      </article>
    </main>
  );
}
