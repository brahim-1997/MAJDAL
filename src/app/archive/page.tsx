import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { archive } from "@/content/archive";
import { ArchiveBrowser } from "@/components/archive/ArchiveBrowser";

export const metadata: Metadata = {
  title: "The Archive",
  description:
    "The MAJDAL Archive: the documented record behind the brand. Every entry carries its evidence tier and its sources.",
};

export default function ArchivePage() {
  const counts = archive.reduce<Record<string, number>>((acc, e) => {
    acc[e.tier] = (acc[e.tier] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">THE ARCHIVE</h1>
          <p className="lead muted phead__lead">
            The record the brand is built on. Every entry is tiered and sourced.
            Where accounts differ, the disagreement is shown rather than resolved
            in favour of the version that reads better.
          </p>
          <p className="meta" style={{ paddingTop: "var(--s-5)" }}>
            {archive.length} entries ·{" "}
            {Object.entries(counts)
              .map(([tier, n]) => `${n} ${tier.toLowerCase()}`)
              .join(" · ")}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="callout callout--verified">
              <p className="callout__h">Evidence tiers</p>
              <p className="muted">
                <strong>Verified</strong> — supported by independent, citable
                sources. <strong>Contested</strong> — sources disagree, or the record
                is incomplete. <strong>Interpretation</strong> — MAJDAL&apos;s own
                reading, never dressed up as history.
              </p>
              <p className="muted" style={{ paddingTop: "var(--s-3)" }}>
                External review by named Palestinian researchers is required before
                any of this reaches a garment. That review has not happened yet, and
                this site says so rather than implying otherwise.
              </p>
            </div>
          </Reveal>

          <ArchiveBrowser entries={archive} />
        </div>
      </section>
    </>
  );
}
