/**
 * A running line. The words are read once by assistive tech; the repeat that
 * makes the loop seamless is hidden from it. Reduced motion: the line stops
 * and wraps, so nothing is cut off.
 */
export function Ticker({
  items,
  className = "",
  speed = 40,
  reverse = false,
}: {
  items: string[];
  className?: string;
  /** Seconds for one full loop. */
  speed?: number;
  reverse?: boolean;
}) {
  const run = (hidden: boolean) => (
    <span className="ticker__run" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="ticker__item">
          {t}
          <span className="ticker__sep" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </span>
  );
  return (
    <div
      className={`ticker ${className}`}
      style={{ ["--ticker-s" as string]: `${speed}s`, ["--ticker-dir" as string]: reverse ? "reverse" : "normal" }}
    >
      <p className="ticker__track">
        {run(false)}
        {run(true)}
      </p>
    </div>
  );
}
