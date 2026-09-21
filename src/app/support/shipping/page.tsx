import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'How and where MAJDAL ships. Nothing ships yet.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">SHIPPING</h1>
          <p className="lead muted phead__lead">How and where MAJDAL ships. Nothing ships yet.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">Status</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Nothing ships yet. Chapter 001 has not opened and no orders can be placed.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">What will be published here</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Destinations, carriers, dispatch times, delivery estimates, tracking, and the full cost including any duties for each region — before the first order is taken, not after.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>Shipping is excluded from the 15% impact calculation, which is based on the product price actually received. That exclusion is stated on the impact page too.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
