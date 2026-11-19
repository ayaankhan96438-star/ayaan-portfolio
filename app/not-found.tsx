import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found-page">
      <span className="eyebrow">404 / WRONG TURN</span>
      <h1>Nothing<br />to see here<span className="accent-dot">.</span></h1>
      <p>This page might have moved, or maybe it never existed.</p>
      <Link href="/#home" className="button button-dark">Back home ↗</Link>
    </main>
  );
}
