import { OLIVE_GEOMETRY } from "./olive-geometry";

/**
 * THE MAJDAL OLIVE TREE — a traditional engraving (scripts/draw-olive.mjs).
 *
 * Rendered as a mask over currentColor, so one drawing prints in any ink of
 * the palette. Two cuts of the same tree:
 *  - engraved: the identity drawing — hatched crown, twisted trunk, roots
 *  - mark:     silhouette, for 16–64px
 *
 * It carries no assigned meaning. Where the site says what it stands for,
 * it says so as MAJDAL's interpretation.
 */
export function Olive({
  variant = "engraved",
  className = "",
  label,
}: {
  variant?: "engraved" | "mark";
  className?: string;
  /** Accessible name. Omit for decorative use. */
  label?: string;
}) {
  return (
    <span
      className={`olive olive--${variant} ${className}`.trim()}
      style={{ aspectRatio: `${OLIVE_GEOMETRY.width} / ${OLIVE_GEOMETRY.height}` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
