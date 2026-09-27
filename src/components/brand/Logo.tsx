/**
 * The official MAJDAL logo — the founder's artwork, never redrawn.
 *
 * Lockups are cropped from brand/assets/majdal-logo-sheet.jpg by
 * scripts/extract-logo.mjs. Bone is the artwork as supplied, for dark grounds.
 * Ink is the same alpha in black, for paper: a monochrome version, used only
 * where the bone artwork would disappear.
 *
 * Protection zone: the height of the "M" on all sides (brand/IDENTITY-LOGO.md).
 * Never stretch, rotate, recolour, or add effects.
 */

export type Lockup = "primary" | "stacked" | "mark";
export type LogoTone = "bone" | "ink";

export const LOGO_SIZES: Record<Lockup, [number, number]> = {
  primary: [627, 485],
  stacked: [267, 229],
  mark: [462, 303],
};

export const logoSrc = (lockup: Lockup, tone: LogoTone) =>
  `/brand/majdal-${lockup}${tone === "ink" ? "-ink" : ""}.webp`;

export function Logo({
  lockup = "stacked",
  tone = "bone",
  className = "",
  alt = "MAJDAL مجدل",
  eager = false,
}: {
  lockup?: Lockup;
  tone?: LogoTone;
  className?: string;
  /** Empty string when a visible label already names it. */
  alt?: string;
  eager?: boolean;
}) {
  const [w, h] = LOGO_SIZES[lockup];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc(lockup, tone)}
      width={w}
      height={h}
      alt={alt}
      className={`logo logo--${lockup} ${className}`.trim()}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      draggable={false}
    />
  );
}
