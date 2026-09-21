import Link from "next/link";
import { chapters } from "@/content/chapters";

/**
 * The generational spine: cloth -> cactus -> seed.
 *
 * Each row is one line of the core story, matched to the documented object
 * that carries it. This is the brand's argument in a single block: resistance
 * held as continuity, expressed through nouns with sources rather than slogans.
 */
export function Spine() {
  return (
    <ol className="spine">
      {chapters.map((chapter) => (
        <li className="spine__row" key={chapter.slug}>
          <Link href={`/chapters/${chapter.slug}`} className="spine__link">
            <span className="spine__num meta">{chapter.number}</span>
            <span className="spine__body">
              <span className="display spine__line">{chapter.storyLine}</span>
              <span className="spine__meta meta">
                {chapter.name}
                {chapter.nameArabic ? (
                  <>
                    {" "}
                    <span className="arabic">{chapter.nameArabic}</span>
                  </>
                ) : null}
                {" — "}
                {chapter.object}
              </span>
              <span className="spine__premise muted">{chapter.premise}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
