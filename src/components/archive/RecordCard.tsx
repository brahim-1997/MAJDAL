import type { ArchiveEntry } from "@/content/archive";
import { TierBadge } from "@/components/TierBadge";

/** Archive ID in the MAJDAL system: MJ-0048-A001. */
export const archiveId = (e: Pick<ArchiveEntry, "index">) => `MJ-0048-${e.index}`;

/**
 * An archive record as a filed document: ID, title, tier, the fields a
 * catalogue card carries, and its summary. Always printed on paper.
 */
export function RecordCard({ entry, className = "", stamp = false }: { entry: ArchiveEntry; className?: string; stamp?: boolean }) {
  return (
    <article className={`rcard paper ${className}`.trim()} data-tier={entry.tier}>
      <p className="rcard__top">
        <span className="docid">{archiveId(entry)}</span>
        <TierBadge tier={entry.tier} />
      </p>
      <h3 className="display rcard__title">{entry.title}</h3>
      <dl className="kv">
        <div><dt>Object</dt><dd>{entry.category}</dd></div>
        <div><dt>Location</dt><dd>{entry.location}</dd></div>
        <div><dt>Date</dt><dd>{entry.period}</dd></div>
        <div><dt>Source</dt><dd>{entry.sources.length} cited</dd></div>
      </dl>
      <p className="rcard__sum">{entry.summary}</p>
      {stamp ? (
        <span className={`stamp rcard__stamp ${entry.tier === "CONTESTED" ? "stamp--red" : "stamp--green"}`} aria-hidden="true">
          Filed · Archive 001
        </span>
      ) : null}
    </article>
  );
}
