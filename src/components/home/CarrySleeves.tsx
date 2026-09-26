import Link from "next/link";
import { KINDS } from "@/content/community";

/**
 * Empty photograph sleeves. MAJDAL holds no photographs of people, and will
 * not use stock or generated ones in their place. So the absence is shown as
 * what it is — empty sleeves in an archive box — and each one is a way in.
 */
export function CarrySleeves() {
  const shown = KINDS.filter((k) => k.value !== "other");
  return (
    <ul className="sleeves">
      {shown.map((k, i) => (
        <li key={k.value} className="sleeves__item" style={{ "--r": `${[-2, 1.5, -1, 2.5, -2.5, 1][i % 6]}deg` } as React.CSSProperties}>
          <Link href={`/roots/carry?kind=${k.value}`} className="sleeve taped">
            <span className="sleeve__frame" aria-hidden="true">
              <span className="sleeve__empty">Not yet received</span>
            </span>
            <span className="sleeve__kind">{k.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
