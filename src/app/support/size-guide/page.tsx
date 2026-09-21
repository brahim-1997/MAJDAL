import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Size guide',
  description: 'Measurements for Chapter 001 garments. Oversized by design.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">SIZE GUIDE</h1>
          <p className="lead muted phead__lead">Measurements for Chapter 001 garments. Oversized by design.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">Fit</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Chapter 001 is cut oversized: dropped shoulder, boxy body. If you want a close fit, size down. If you want the fit the garments were designed for, take your usual size.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Measurements</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Garment measurements are not published yet. Sampling is not complete, and publishing numbers before measuring a finished garment would mean guessing at something people use to spend money.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>They will be published here — chest, length, shoulder and sleeve, flat measurements in centimetres — before the chapter opens.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
