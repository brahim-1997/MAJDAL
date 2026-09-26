/**
 * THE OVERTURE — first visit only.
 *
 *   48  ->  EVERYTHING STARTS WITH A PLACE.  ->  cut.
 *
 * Pure CSS so it runs without JavaScript and cannot hang. A tiny script in
 * <head> (see layout.tsx) marks the session as seen before first paint, so a
 * returning visitor never sits through it twice. It never blocks: it lets
 * pointer events through, it is hidden from assistive tech, and reduced
 * motion removes it entirely.
 */
export function Overture() {
  return (
    <div className="overture" aria-hidden="true">
      <span className="overture__48">48</span>
      <span className="overture__line">EVERYTHING STARTS WITH A PLACE.</span>
    </div>
  );
}
