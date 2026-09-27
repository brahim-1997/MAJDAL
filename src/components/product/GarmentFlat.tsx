import type { Product } from "@/content/products";

/**
 * Tech-pack flats: FRONT and BACK, the way a garment is specified to a
 * factory. These are design drawings and are captioned as such — never
 * product photography. A render of a garment that does not physically exist
 * yet, shown as if it did, would be the same lie as a wrong coordinate.
 *
 * The red seams are THE THREAD: the line that runs through the site ends
 * here, as the seam where the colour band meets the body.
 */

type Callout = { n: number; x: number; y: number; text: string };

const HOODIE =
  "M70 34 C64 2 136 2 130 34 L166 44 L194 150 L194 166 L176 168 L176 152 L164 84 L164 230 L36 230 L36 84 L24 152 L24 168 L6 166 L6 150 L34 44 Z";
const TEE =
  "M70 14 C80 32 120 32 130 14 L168 24 L196 80 L172 94 L164 76 L164 210 L36 210 L36 76 L28 94 L4 80 L32 24 Z";
const TEE_BACK =
  "M70 14 C80 20 120 20 130 14 L168 24 L196 80 L172 94 L164 76 L164 210 L36 210 L36 76 L28 94 L4 80 L32 24 Z";

function Hoodie({ p, back, id }: { p: Product; back?: boolean; id: string }) {
  const sw = p.colourway.swatch;
  return (
    <g>
      <clipPath id={id}>
        <path d={HOODIE} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="200" height="240" fill={sw.body} />
        {sw.band ? <rect y="92" width="200" height="18" fill={sw.band} /> : null}
        {sw.trim ? (
          <>
            <path d="M70 34 C64 2 136 2 130 34 L120 48 L80 48 Z" fill={sw.trim} />
            <rect y="214" width="200" height="16" fill={sw.trim} />
            <rect x="0" y="148" width="26" height="22" fill={sw.trim} />
            <rect x="174" y="148" width="26" height="22" fill={sw.trim} />
          </>
        ) : null}
        {!back ? <path d="M80 40 C78 14 122 14 120 40 C110 50 90 50 80 40 Z" fill="#080808" opacity="0.85" /> : null}
      </g>
      <path d={HOODIE} className="gf__line" />
      <path d="M42 46 L40 88 M158 46 L160 88" className="gf__line gf__thin" />
      <path d="M36 214 L164 214 M6 150 L24 152 M176 152 L194 150" className="gf__line gf__thin" />
      {back ? (
        <path d="M100 6 L100 44" className="gf__line gf__thin" />
      ) : (
        <>
          <path d="M62 150 L138 150 L150 204 L50 204 Z" className="gf__line gf__thin" />
          <path d="M93 46 L91 78 M107 46 L109 78" className="gf__line gf__thin" />
          <rect x="94" y="41" width="12" height="7" className="gf__label" />
          <text x="100" y="46.6" className="gf__labeltext">48</text>
        </>
      )}
      {/* THE THREAD, as seam */}
      {sw.band ? <path d="M0 92 L200 92 M0 110 L200 110" clipPath={`url(#${id})`} className="gf__seam" pathLength={1} /> : null}
    </g>
  );
}

function Tee({ p, back, id }: { p: Product; back?: boolean; id: string }) {
  const sw = p.colourway.swatch;
  const outline = back ? TEE_BACK : TEE;
  const isArchive = p.slug === "archive-tee";
  return (
    <g>
      <clipPath id={id}>
        <path d={outline} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="200" height="220" fill={sw.body} />
        {back && sw.band ? <rect y="40" width="200" height="16" fill={sw.band} /> : null}
      </g>
      <path d={outline} className="gf__line" />
      <path d={back ? "M70 14 C80 24 120 24 130 14" : "M70 14 C80 38 120 38 130 14"} className="gf__line gf__thin" />
      <path d="M44 22 L40 78 M156 22 L160 78" className="gf__line gf__thin" />
      <path d="M36 202 L164 202" className="gf__line gf__thin gf__dash" />
      {!back && !isArchive ? (
        <text x="150" y="198" className="gf__hem">48</text>
      ) : null}
      {isArchive && !back ? (
        <g className="gf__print">
          <text x="100" y="92" textAnchor="middle" className="gf__word" fill={sw.print}>MAJDAL</text>
          <text x="100" y="116" textAnchor="middle" className="gf__wordar" fill={sw.print}>مجدل</text>
        </g>
      ) : null}
      {isArchive && back ? (
        <g>
          <rect x="62" y="46" width="76" height="104" fill={sw.print} />
          {[58, 66, 74, 82, 98, 106, 114, 130, 138].map((y) => (
            <rect key={y} x="68" y={y} width={y % 3 ? 58 : 40} height="3" fill={sw.body} opacity="0.85" />
          ))}
          {sw.hairlines?.map((c, i) => (
            <rect key={c} x="62" y={156 + i * 4} width="76" height="1.2" fill={c} />
          ))}
        </g>
      ) : null}
      {back && sw.band ? (
        <path d="M0 40 L200 40 M0 56 L200 56" clipPath={`url(#${id})`} className="gf__seam" pathLength={1} />
      ) : null}
    </g>
  );
}

function Cap({ p }: { p: Product }) {
  const sw = p.colourway.swatch;
  return (
    <g transform="translate(0 40)">
      <path d="M34 104 C34 34 166 34 166 104 Z" fill={sw.body} className="gf__line" />
      <path d="M22 104 Q100 140 178 104 Q100 118 22 104 Z" fill={sw.trim} className="gf__line" />
      <path d="M100 36 L100 104 M100 36 Q70 52 62 104 M100 36 Q130 52 138 104" className="gf__line gf__thin" />
      <circle cx="100" cy="36" r="3.5" fill={sw.body} className="gf__line" />
      <text x="100" y="86" textAnchor="middle" className="gf__capar" fill={sw.print}>مجدل</text>
      <path d="M34 104 Q100 112 166 104" className="gf__seam" pathLength={1} />
    </g>
  );
}

export function calloutsFor(p: Product): Callout[] {
  if (p.kind === "hoodie")
    return [
      { n: 1, x: 150, y: 92, text: "Flatlock seam — the thread. Where the band meets the body." },
      { n: 2, x: 60, y: 101, text: `Colour-block band — colourway ${p.colourway.name}. The name is a documented al-Majdal fabric.` },
      { n: 3, x: 110, y: 180, text: "480 GSM loopback cotton, garment-washed." },
      { n: 4, x: 100, y: 44, text: "Woven 48 label, inner neck." },
      { n: 5, x: 159, y: 60, text: "Dropped shoulder, boxy body." },
    ];
  if (p.kind === "tee")
    return p.slug === "archive-tee"
      ? [
          { n: 1, x: 100, y: 96, text: "Front: MAJDAL / مجدل, stacked. Water-based screen print." },
          { n: 2, x: 320, y: 90, text: "Back: the archive card, typeset from the dossier." },
          { n: 3, x: 320, y: 162, text: "Silk hairlines — the documented Majdalawi silk colours, at thread scale." },
          { n: 4, x: 140, y: 60, text: "260 GSM single jersey. Oversized, boxy." },
        ]
      : [
          { n: 1, x: 320, y: 48, text: "Back yoke band — the thread runs along both seams." },
          { n: 2, x: 150, y: 196, text: "48 at left hem." },
          { n: 3, x: 100, y: 120, text: "260 GSM single jersey, enzyme-washed." },
        ];
  return [
    { n: 1, x: 100, y: 124, text: "مجدل, flat embroidery. Blocked pending native-speaker review." },
    { n: 2, x: 150, y: 148, text: "Washed black brim." },
    { n: 3, x: 100, y: 76, text: "6-panel structured crown, brushed twill." },
  ];
}

export function GarmentFlat({
  product,
  callouts = false,
  uid,
}: {
  product: Product;
  callouts?: boolean;
  /** Distinguishes two drawings of the same object on one page: clip-path ids must be unique. */
  uid?: string;
}) {
  const id = `gf-${product.slug}-${uid ?? (callouts ? "c" : "p")}`;
  const cap = product.kind === "cap";
  const vb = cap ? "0 0 200 200" : "0 0 440 250";
  const notes = callouts ? calloutsFor(product) : [];
  return (
    <figure className="gf">
      <svg viewBox={vb} role="img" aria-label={`Technical drawing of the ${product.name}, ${cap ? "front view" : "front and back"}`}>
        {cap ? (
          <Cap p={product} />
        ) : (
          <>
            <g>{product.kind === "hoodie" ? <Hoodie p={product} id={`${id}-f`} /> : <Tee p={product} id={`${id}-f`} />}</g>
            <g transform="translate(236 0)">
              {product.kind === "hoodie" ? <Hoodie p={product} back id={`${id}-b`} /> : <Tee p={product} back id={`${id}-b`} />}
            </g>
            <text x="100" y="247" textAnchor="middle" className="gf__view">FRONT</text>
            <text x="336" y="247" textAnchor="middle" className="gf__view">BACK</text>
          </>
        )}
        {notes.map((c) => (
          <g key={c.n} className="gf__callout">
            <circle cx={c.x} cy={c.y} r="7" />
            <text x={c.x} y={c.y + 3} textAnchor="middle">
              {c.n}
            </text>
          </g>
        ))}
      </svg>
      {notes.length ? (
        <ol className="gf__notes">
          {notes.map((c) => (
            <li key={c.n}>
              <span className="gf__n">{c.n}</span>
              {c.text}
            </li>
          ))}
        </ol>
      ) : null}
      <figcaption className="gf__cap meta">
        Technical drawing · Object {product.object} · not product photography
      </figcaption>
    </figure>
  );
}
