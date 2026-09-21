import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CarryForm } from "@/components/community/CarryForm";

export const metadata: Metadata = {
  title: "What do you carry?",
  description:
    "The MAJDAL Archive grows through the people in it. Send an object, a photograph, a place, a name or a family story — read by a person, published only with your permission.",
};

export default function CarryPage() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <Link href="/roots" className="backlink" style={{ paddingTop: 0 }}>
            ← The Roots
          </Link>
          <h1 className="display phead__title">WHAT DO YOU CARRY?</h1>
          <p className="lead muted phead__lead">
            An object. A photograph. A place. A name. A sentence somebody said
            once and nobody wrote down. The archive is the part of this brand
            that can only be built by the people in it.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <CarryForm />
            </Reveal>

            <Reveal delay={80}>
              <div className="stack" style={{ ["--flow" as string]: "var(--s-5)" }}>
                <div className="callout callout--verified">
                  <p className="callout__h">What happens to what you send</p>
                  <p className="muted">
                    A person reads it. If it is published it enters THE MAJDAL
                    ARCHIVE with a record number, credited the way you chose,
                    and you can have it removed at any point after that.
                  </p>
                </div>

                <div className="callout">
                  <p className="callout__h">Submissions are not open yet</p>
                  <p className="muted">
                    The form works and it validates, but nothing is stored. A
                    named moderator, a privacy policy and a working withdrawal
                    route have to exist before this brand accepts anyone&apos;s
                    family memory.
                  </p>
                </div>

                <div className="factlist">
                  {[
                    ["Read by", "A person, not a filter"],
                    ["Published", "Only with permission"],
                    ["Credit", "Name, initials, or anonymous"],
                    ["Withdrawal", "Any time, including after"],
                    ["Guarantee", "None — review decides"],
                  ].map(([k, v]) => (
                    <div className="factlist__row" key={k}>
                      <span className="factlist__k">{k}</span>
                      <span className="factlist__v">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
