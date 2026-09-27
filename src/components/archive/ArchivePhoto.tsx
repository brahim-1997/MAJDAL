import type { ResolvedSource } from "@/lib/sources";

/**
 * An archive object in a frame, with its catalogue record.
 *
 * If the file is on file, the object is shown. If not, the frame is EMPTY and
 * says so, with a link to the object at its holder. Nothing is substituted.
 * Presentational only — resolve the source on the server (src/lib/sources).
 */
export function ArchivePhoto({
  source: s,
  className = "",
  compact = false,
  priority = false,
}: {
  source: ResolvedSource;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className={`aphoto ${compact ? "aphoto--compact" : ""} ${className}`.trim()} data-onfile={s.onFile}>
      <div className="aphoto__frame" style={{ aspectRatio: String(s.aspect) }}>
        {s.shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.file} alt={s.description} loading={priority ? "eager" : "lazy"} decoding="async" />
        ) : (
          <div className="aphoto__empty">
            <span className="aphoto__emptyid">{s.reference}</span>
            <span className="aphoto__emptynote">
              {s.hold ? (
                <>On hold until reviewed.</>
              ) : (
                <>
                  {s.kind === "map" ? "Sheet" : "Photograph"} not yet on file.
                  <br />
                  The frame stays empty until it is.
                </>
              )}
            </span>
            <a className="aphoto__holder" href={s.url} target="_blank" rel="noopener noreferrer">
              View at the holder<span aria-hidden="true"> ↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        )}
      </div>
      <figcaption className="aphoto__cap">
        <span className="aphoto__title">{s.title}</span>
        {s.titleNote ? <span className="aphoto__note">{s.titleNote}</span> : null}
        {!compact && (
          <dl className="kv">
            <div><dt>Date</dt><dd>{s.date}</dd></div>
            <div><dt>Made by</dt><dd>{s.creator}</dd></div>
            <div><dt>Location</dt><dd>{s.place}</dd></div>
            <div><dt>Source</dt><dd>{s.holder}</dd></div>
            <div><dt>Rights</dt><dd>{s.rights}</dd></div>
          </dl>
        )}
      </figcaption>
    </figure>
  );
}
