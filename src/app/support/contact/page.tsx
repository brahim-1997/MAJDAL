import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach MAJDAL, and what we answer.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">CONTACT</h1>
          <p className="lead muted phead__lead">How to reach MAJDAL, and what we answer.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">Reaching us</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>There is no contact address published yet. Publishing an inbox nobody is staffed to answer is worse than publishing none.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>When it exists it will be listed here, with a stated response time we can actually meet.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Research and corrections</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>If you have found an error in the archive, that is the message we most want to receive, and it will be the first inbox we open. Corrections are published, not quietly fixed.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Press and collaboration</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Palestinian researchers, weavers, embroiderers, photographers and translators: MAJDAL pays professional rates, agreed in writing, in advance of delivery. Credit is public unless you ask otherwise.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
