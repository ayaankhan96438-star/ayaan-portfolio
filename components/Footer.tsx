import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/#home" className="footer-logo">ayaan<span>.</span></Link>
      <span>DESIGNED WITH INTENTION. BUILT WITH CODE.</span>
      <span>© {new Date().getFullYear()} AYAAN KHAN</span>
    </footer>
  );
}
