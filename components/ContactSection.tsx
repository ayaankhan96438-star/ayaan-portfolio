"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Send } from "lucide-react";
import { siteConfig } from "@/lib/site";

type Feedback = { kind: "info" | "error"; message: string } | null;

export function ContactSection() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setFeedback({ kind: "info", message: "Email address copied to your clipboard." });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setFeedback({ kind: "error", message: "Clipboard access is unavailable here. You can still select and copy the email address above." });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const senderEmail = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !senderEmail || message.length < 10) {
      setFeedback({ kind: "error", message: "Please complete all fields and write a message of at least 10 characters." });
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${senderEmail}`);
    setFeedback({ kind: "info", message: "Your email application should open with this message. Nothing has been sent by the website itself." });
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section" id="contact" data-spotlight-zone>
      <div className="contact-topline">
        <span className="section-number">06 / CONTACT</span>
        <span>THE NEXT GOOD THING STARTS WITH A HELLO.</span>
      </div>

      <h2 data-cinematic-reveal>
        Say hi.<br />
        <span className="contact-bring-line"><span className="contact-bring-word">Bring</span> the idea.</span><br />
        <span className="contact-accent-line">I&apos;ll <span className="contact-bring-word">bring</span> the code.</span>
      </h2>

      <div className="contact-feature-grid" data-cinematic-reveal>
        <div className="contact-bottom">
          <div className="contact-email-block">
            <span className="eyebrow">GOT A PROJECT, QUESTION, OR MEME?</span>
            <a className="contact-email" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email} <ArrowUpRight size={22} strokeWidth={1.5} />
            </a>
            <button className="contact-copy-button" type="button" onClick={copyEmail}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy email"}
            </button>
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
            <a href={`mailto:${siteConfig.email}`} aria-label="Email Ayaan Khan">
              <Mail size={18} /> Email <ArrowUpRight size={14} />
            </a>
            {siteConfig.resumeUrl ? <a href={siteConfig.resumeUrl} download aria-label="Download resume">Resume <ArrowUpRight size={14} /></a> : null}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading"><span className="eyebrow">SEND A NOTE</span><span>01 — 03</span></div>
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="How should I call you?" maxLength={80} required />
          <label htmlFor="contact-email-input">Email address</label>
          <input id="contact-email-input" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
          <label htmlFor="contact-message">Your message</label>
          <textarea id="contact-message" name="message" rows={4} minLength={10} maxLength={3000} placeholder="Tell me a little about it..." required />
          <button className="contact-submit" type="submit">Prepare email <Send size={15} /></button>
          {feedback ? <p className={`contact-feedback contact-feedback-${feedback.kind}`} role="status">{feedback.message}</p> : <p className="contact-form-note">This form opens your email app. It does not send or store your message.</p>}
        </form>
      </div>

      <Link className="back-to-top" href="#home">
        Back to top <ArrowDown size={16} />
      </Link>
    </section>
  );
}
