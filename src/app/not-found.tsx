import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="shell">
        <p className="meta">404</p>
        <h1 className="display d2" style={{ paddingTop: "var(--s-4)" }}>
          NOT IN THE ARCHIVE
        </h1>
        <p className="lead muted" style={{ paddingTop: "var(--s-5)", maxWidth: "48ch" }}>
          This page does not exist. The record does.
        </p>
        <p style={{ paddingTop: "var(--s-7)", display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
          <Link href="/" className="btn">
            Home
          </Link>
          <Link href="/archive" className="btn btn--ghost">
            The Archive
          </Link>
        </p>
      </div>
    </section>
  );
}
