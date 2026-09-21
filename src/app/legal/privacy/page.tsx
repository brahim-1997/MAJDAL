import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What MAJDAL collects. Currently: nothing.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">PRIVACY</h1>
          <p className="lead muted phead__lead">What MAJDAL collects. Currently: nothing.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">What we collect</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Nothing. There is no analytics on this site, no tracking pixel, no advertising identifier, and no third-party script. The typefaces are served from this domain rather than a font CDN, so loading a page does not tell anyone else that you did.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>The community form and the submission form do not store what you type. They validate in your browser and then tell you they are not open.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">When that changes</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Before MAJDAL collects anything, this page will state exactly what is collected, why, how long it is kept, who processes it, and how to have it deleted. Measurement will be privacy-first, cookieless, and will ask for consent, and the site will work fully if you decline.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>We will never sell or share personal data, and we will never track members individually in order to target them.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">Why this page exists now</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>A brand handling other people's family history should have written its privacy position before it asks for anything, not after.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
