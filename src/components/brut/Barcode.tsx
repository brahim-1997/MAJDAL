/**
 * A real Code 39 barcode. Point a scanner at it and it reads the value.
 *
 * Not decoration: MAJDAL's rule for codes is that every hidden thing
 * resolves to something true. A fake barcode would be a small lie on a
 * brand that has been careful not to tell any.
 */

// Code 39: 9 elements per character (bar, space, bar ... bar); 1 = wide.
const CODE39: Record<string, string> = {
  "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000",
  "4": "000110001", "5": "100110000", "6": "001110000", "7": "000100101",
  "8": "100100100", "9": "001100100", A: "100001001", B: "001001001",
  C: "101001000", D: "000011001", E: "100011000", F: "001011000",
  G: "000001101", H: "100001100", I: "001001100", J: "000011100",
  K: "100000011", L: "001000011", M: "101000010", N: "000010011",
  O: "100010010", P: "001010010", Q: "000000111", R: "100000110",
  S: "001000110", T: "000010110", U: "110000001", V: "011000001",
  W: "111000000", X: "010010001", Y: "110010000", Z: "011010000",
  "-": "010000101", ".": "110000100", " ": "011000100", "*": "010010100",
};

export function encode39(value: string): { x: number; w: number }[] {
  const text = `*${value.toUpperCase()}*`;
  const NARROW = 1;
  const WIDE = 2.6;
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let c = 0; c < text.length; c++) {
    const pattern = CODE39[text[c] as string];
    if (!pattern) throw new Error(`Code 39 cannot encode "${text[c]}"`);
    for (let i = 0; i < 9; i++) {
      const w = pattern[i] === "1" ? WIDE : NARROW;
      if (i % 2 === 0) bars.push({ x, w });
      x += w;
    }
    x += NARROW; // inter-character gap
  }
  return bars.map((b) => ({ x: b.x, w: b.w })).concat([{ x: -1, w: x }]); // last = total width
}

export function Barcode({
  value,
  height = 44,
  className = "",
  caption = true,
}: {
  value: string;
  height?: number;
  className?: string;
  caption?: boolean;
}) {
  const all = encode39(value);
  const total = all.pop()!.w;
  return (
    <figure className={`barcode ${className}`.trim()}>
      <svg
        viewBox={`0 0 ${total} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Code 39 barcode reading ${value}`}
      >
        {all.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} />
        ))}
      </svg>
      {caption ? <figcaption className="barcode__cap">*{value}*</figcaption> : null}
    </figure>
  );
}
