import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { JoinRoots } from "@/components/JoinRoots";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "The Roots",
  description:
    "THE ROOTS is the MAJDAL community. Free, earned by participation rather than purchase, and the brand's first objective ahead of revenue.",
};

const ways = [
  {
    n: "01",
    name: "The archive first",
    body: "Every archive entry goes to THE ROOTS before it is published, with its sources attached. If we have made an error, members are the ones who catch it.",
  },
  {
    n: "02",
    name: "The access window",
    body: "Chapters open to THE ROOTS before anyone else. The window is long enough to think, not a sixty-second scramble engineered to cause panic.",
  },
  {
    n: "03",
    name: "One real decision per chapter",
    body: "Members vote on one decision that genuinely changes the product — a colourway, a garment, which recipient the chapter's impact goes to. We publish the count and we honour it.",
  },
  {
    n: "04",
    name: "Named contribution",
    body: "Research, translation, photography, a family record from al-Majdal. Contributions are credited by name unless the person asks not to be.",
  },
];

const rituals = [
  {
    name: "THE READING",
    cadence: "Monthly",
    body: "One archive entry, read and discussed in a live room. A researcher or practitioner joins where the subject calls for it, and is paid for their time.",
  },
  {
    name: "THE TABLE",
    cadence: "Per chapter, in person",
    body: "A shared meal in one city per chapter. Free, small, no cameras as the point. Whoever is in the room is in the room.",
  },
  {
    name: "CHAPTER CLOSE",
    cadence: "End of each chapter",
    body: "The numbers published in public: units sold, eligible revenue, impact committed, transferred, outstanding. Held on the same day the chapter closes, every time.",
  },
  {
    name: "THE HANDOVER",
    cadence: "Annual",
    body: "Members bring one object, photograph or story their family carried, with the permission of whoever it belongs to. Nothing is published without that permission.",
  },
];

export default function RootsPage() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">THE ROOTS</h1>
          <p className="lead muted phead__lead">
            MAJDAL&apos;s first objective is not sales. It is building a real community
            around this work. THE ROOTS is that community: free, and your place in it
            is earned by turning up rather than by spending.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <div className="prose stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <h2 className="display d3">Nobody buys their way up.</h2>
                <p>
                  There is no spend tier, no points, no status unlocked by order
                  history. A member who has never bought anything and a member who has
                  bought every chapter have the same standing and the same vote.
                </p>
                <p>
                  That is a deliberate constraint and it costs us revenue. It is also
                  the only way the community stays a community instead of becoming a
                  loyalty scheme with a cultural theme.
                </p>
                <p className="lead">
                  {site.story.join(" ")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <div className="callout">
                  <p className="callout__h">Join</p>
                  <JoinRoots compact />
                </div>
                <div className="callout callout--verified">
                  <p className="callout__h">What we will not do</p>
                  <p className="muted">
                    Sell or share your details. Send you a sales message every week.
                    Use the community as a marketing asset in front of the community.
                    Run a fake countdown. Post images of Palestinian suffering to move
                    product.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">01</span>
              <span className="label__name">What membership actually is</span>
            </p>
          </Reveal>
          <div className="tiers">
            {ways.map((w, i) => (
              <Reveal as="div" key={w.n} delay={i * 60}>
                <div className="tiercard">
                  <span className="tiercard__n">{w.n}</span>
                  <h3 className="display d5">{w.name}</h3>
                  <p className="muted">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="label">
              <span className="label__index">02</span>
              <span className="label__name">Rituals</span>
            </p>
          </Reveal>

          <Reveal>
            <p className="lead muted" style={{ maxWidth: "58ch", paddingBottom: "var(--s-7)" }}>
              A community needs things that happen on a schedule, whether or not
              there is something to sell that month.
            </p>
          </Reveal>

          <div>
            {rituals.map((r, i) => (
              <Reveal as="div" key={r.name} className="ritual" delay={i * 50}>
                <p className="meta">{r.cadence}</p>
                <h3 className="display ritual__name">{r.name}</h3>
                <p className="muted" style={{ maxWidth: "68ch" }}>
                  {r.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="callout" style={{ marginTop: "var(--s-9)" }}>
              <p className="callout__h">Status</p>
              <p className="muted">
                None of these rituals has run yet. They are scheduled commitments, not
                a description of something already happening — and this page will say
                so until the first one has taken place.{" "}
                <Link href="/impact" className="link">
                  The same standard applies to impact.
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
