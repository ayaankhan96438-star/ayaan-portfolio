import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer site-footer-enhanced">
      <Link href="/#home" className="footer-logo">ayaan<span>.</span></Link>
      <span className="footer-note">DESIGNED WITH INTENTION. BUILT WITH CODE.</span>
      <nav className="footer-links" aria-label="Footer links">
        <Link href="/#work">Work</Link>
        <Link href="/#journey">Journey</Link>
        <Link href="/#contact">Contact</Link>
        {siteConfig.github ? <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /><ArrowUpRight size={11} /></a> : null}
        {siteConfig.linkedin ? <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /><ArrowUpRight size={11} /></a> : null}
        <a href={`mailto:${siteConfig.email}`} aria-label="Email"><Mail size={15} /></a>
      </nav>
      <span>© {new Date().getFullYear()} AYAAN KHAN</span>
    </footer>
  );
}
