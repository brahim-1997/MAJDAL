/** Printer's registration mark. Where the plates are meant to line up. */
export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg className={`xhair ${className}`.trim()} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
