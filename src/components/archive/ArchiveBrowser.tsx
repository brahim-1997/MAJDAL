"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TierBadge } from "@/components/TierBadge";
import { CATEGORIES, type ArchiveEntry, type Category } from "@/content/archive";
import { track } from "@/lib/analytics";

type View = "list" | "grid";

/**
 * The archive, browsable. Filtering happens on already-rendered data, so the
 * records are in the HTML for crawlers and for anyone without JavaScript —
 * the filters are an enhancement, never the way in.
 */
export function ArchiveBrowser({ entries }: { entries: ArchiveEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [tier, setTier] = useState<ArchiveEntry["tier"] | "ALL">("ALL");
  const [view, setView] = useState<View>("list");

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const e of entries) c.set(e.category, (c.get(e.category) ?? 0) + 1);
    return c;
  }, [entries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (category !== "ALL" && e.category !== category) return false;
      if (tier !== "ALL" && e.tier !== tier) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.index.toLowerCase().includes(q) ||
        e.tags.some((t) => t.includes(q))
      );
    });
  }, [entries, query, category, tier]);

  const filtered = category !== "ALL" || tier !== "ALL" || query.trim() !== "";

  return (
    <div className="abrowse">
      <div className="abrowse__bar">
        <div className="abrowse__search">
          <label htmlFor="archive-search" className="visually-hidden">
            Search the archive
          </label>
          <input
            id="archive-search"
            type="search"
            className="field"
            placeholder="Search records, places, tags"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="abrowse__views" role="group" aria-label="View">
          {(["list", "grid"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              className="chip"
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="abrowse__filters">
        <div className="chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="chip"
            aria-pressed={category === "ALL"}
            onClick={() => setCategory("ALL")}
          >
            All {entries.length}
          </button>
          {CATEGORIES.filter((c) => counts.get(c)).map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                track("archive_filter", { category: c });
              }}
            >
              {c.toLowerCase()} {counts.get(c)}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="Filter by evidence">
          {(["ALL", "VERIFIED", "CONTESTED", "INTERPRETATION"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className="chip chip--tier"
              data-tier={t}
              aria-pressed={tier === t}
              onClick={() => setTier(t)}
            >
              {t === "ALL" ? "any evidence" : t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="abrowse__count meta" aria-live="polite">
        {results.length} of {entries.length} records
        {filtered ? " shown" : " held"}
      </p>

      {results.length === 0 ? (
        <div className="empty">
          <p className="display d5">NO RECORD MATCHES.</p>
          <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "56ch" }}>
            The archive holds {entries.length} records and is deliberately
            incomplete. If you carry something that belongs here, it can enter
            the archive through review.
          </p>
          <p style={{ paddingTop: "var(--s-5)", display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setQuery("");
                setCategory("ALL");
                setTier("ALL");
              }}
            >
              Clear filters
            </button>
            <Link href="/roots/carry" className="btn">
              What do you carry?
            </Link>
          </p>
        </div>
      ) : view === "list" ? (
        <ul className="alist">
          {results.map((e) => (
            <li key={e.slug} className="aitem">
              <Link
                href={`/archive/${e.slug}`}
                className="aitem__link"
                onClick={() => track("archive_open", { id: e.index })}
              >
                <span className="aitem__head">
                  <span className="aitem__index">{e.index}</span>
                  <span className="display aitem__title">{e.title}</span>
                  <TierBadge tier={e.tier} />
                </span>
                <span className="aitem__summary">{e.summary}</span>
                <span className="meta arec__meta">
                  {e.category.toLowerCase()} — {e.location} — {e.period}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="agrid">
          {results.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/archive/${e.slug}`}
                className="acard"
                onClick={() => track("archive_open", { id: e.index })}
              >
                <span className="acard__top">
                  <span className="aitem__index">{e.index}</span>
                  <TierBadge tier={e.tier} />
                </span>
                <span className="display acard__title">{e.title}</span>
                <span className="acard__summary muted">{e.summary}</span>
                <span className="meta arec__meta">
                  {e.category.toLowerCase()} — {e.location}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
