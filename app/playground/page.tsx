import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MousePointer2 } from "lucide-react";
import { LiveCodePlayground } from "@/components/LiveCodePlayground";

export const metadata: Metadata = {
  title: "Live Playground",
  description: "A small interactive HTML, CSS and JavaScript playground by Ayaan Khan.",
};

export default function PlaygroundPage() {
  return (
    <main className="playground-page">
      <header className="playground-page-hero">
        <div className="playground-page-topline">
          <Link href="/#work"><ArrowLeft size={15} /> BACK TO PORTFOLIO</Link>
          <span>PERSONAL LAB / 001</span>
        </div>
        <div className="playground-page-hero-content" data-cinematic-reveal>
          <div>
            <span className="playground-page-kicker"><MousePointer2 size={14} /> A PLACE TO TRY THINGS</span>
            <h1>Code is better<br />when it <em>moves.</em></h1>
          </div>
          <div className="playground-page-copy">
            <span className="playground-page-index">001 — EXPERIMENT</span>
            <p>A little interactive corner of my portfolio. Change the HTML, CSS or JavaScript and see what happens. No pressure to get it right on the first try.</p>
            <span className="playground-page-scroll">SCROLL TO THE PLAYGROUND <ArrowUpRight size={14} /></span>
          </div>
        </div>
        <div className="playground-page-bottomline"><span>HTML / CSS / JAVASCRIPT</span><span>MAKE A CHANGE. SEE A CHANGE.</span></div>
      </header>

      <LiveCodePlayground />

      <section className="playground-page-outro" data-cinematic-reveal>
        <span>THAT&apos;S THE WHOLE POINT</span>
        <p>Try a different color. Change the copy. Break something, fix it, and see what you learn.</p>
        <Link href="/#work">Back to selected work <ArrowUpRight size={16} /></Link>
      </section>
    </main>
  );
}
