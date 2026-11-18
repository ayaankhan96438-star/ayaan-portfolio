import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-topline">
        <span className="section-number">04 / CONTACT</span>
        <span>THE NEXT GOOD THING STARTS WITH A HELLO.</span>
      </div>

      <h2>
        Say hi.<br />
        <span className="contact-bring-line"><span className="contact-bring-word">Bring</span> the idea.</span><br />
        <span className="contact-accent-line">I&apos;ll <span className="contact-bring-word">bring</span> the code.</span>
      </h2>

      <div className="contact-bottom">
        <div className="contact-email-block">
          <span className="eyebrow">GOT A PROJECT, QUESTION, OR MEME?</span>
          {siteConfig.email ? (
            <a className="contact-email" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email} <ArrowUpRight size={22} strokeWidth={1.5} />
            </a>
          ) : siteConfig.github ? (
            <a className="contact-email" href={siteConfig.github} target="_blank" rel="noreferrer">
              Find me on GitHub <ArrowUpRight size={22} strokeWidth={1.5} />
            </a>
          ) : null}
        </div>

        <div className="contact-links">
          {siteConfig.github ? (
            <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} /> GitHub <ArrowUpRight size={14} />
            </a>
          ) : null}
          {siteConfig.linkedin ? (
            <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} /> LinkedIn <ArrowUpRight size={14} />
            </a>
          ) : null}
          {siteConfig.email ? (
            <a href={`mailto:${siteConfig.email}`} aria-label="Email Ayaan Khan">
              <Mail size={18} /> Email <ArrowUpRight size={14} />
            </a>
          ) : null}
        </div>
      </div>

      <Link className="back-to-top" href="#home">
        Back to top <ArrowDown size={16} />
      </Link>
    </section>
  );
}
