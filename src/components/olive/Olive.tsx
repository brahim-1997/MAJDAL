import { OLIVE_GEOMETRY } from "./olive-geometry";

/**
 * THE MAJDAL OLIVE TREE — our drawing (scripts/draw-olive.mjs).
 *
 * Rendered as a mask over currentColor, so one drawing prints in any ink of
 * the palette. Three cuts of the same tree:
 *  - woodcut: the identity drawing, carved leaves and bark
 *  - pencil:  the same tree as a hand draws it on a map
 *  - mark:    silhouette, for 16–64px
 *
 * It carries no assigned meaning. Where the site says what it stands for,
 * it says so as MAJDAL's interpretation.
 */
export function Olive({
  variant = "woodcut",
  className = "",
  label,
}: {
  variant?: "woodcut" | "pencil" | "mark";
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
