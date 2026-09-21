import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import {
  formatMoney,
  getImpactTotals,
  getRecipient,
  ledger,
} from "@/lib/impact";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "15% of every eligible MAJDAL product sale is committed to supporting people in Palestine. This is the public ledger, including what has not yet been transferred.",
};

export default function ImpactPage() {
  const totals = getImpactTotals();

  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">IMPACT</h1>
          <p className="lead muted phead__lead">
            {site.impactPercent}% of every eligible product sale is committed to
            supporting people in Palestine. This page is the ledger, and it shows
            money owed separately from money sent and money confirmed received.
          </p>
          <p className="meta" style={{ paddingTop: "var(--s-5)" }}>
            Policy v{ledger.policyVersion} · Last updated {ledger.lastUpdated}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          {/* ---------- HEADLINE: the verified figure only ---------- */}
          <Reveal>
            <div className="callout" style={{ marginBottom: "var(--s-6)" }}>
              <p className="callout__h">System under preparation</p>
              <p className="muted">
                MAJDAL intends to allocate {site.impactPercent}% of eligible
                product sales to support people in Palestine. Public reporting
                will begin once verified transfers are made. No transfer has been
                made, because nothing has been sold.
              </p>
            </div>

            <div className="impact__headline">
              <span className="meta">Confirmed received by recipients</span>
              <span className="impact__n">{formatMoney(totals.verifiedCents)}</span>
              <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "58ch" }}>
                This is the only figure MAJDAL will ever present as impact
                delivered. It counts money a recipient has confirmed receiving, with
                a receipt reference on file. Committed and in-transit funds are shown
                below, separately, and are never added into this number.
              </p>
            </div>
          </Reveal>

          {/* ---------- THE FOUR STAGES ---------- */}
          <Reveal>
            <p className="label" style={{ marginTop: "var(--s-9)" }}>
              <span className="label__index">01</span>
              <span className="label__name">Where the money is</span>
            </p>
          </Reveal>

          <div className="impact__flow">
            {[
              {
                stage: "accrued",
                label: "Committed",
                value: totals.accruedCents,
                desc: `${site.impactPercent}% of eligible sales. Owed, not yet sent.`,
              },
              {
                stage: "transferred",
                label: "Transferred",
                value: totals.transferredCents,
                desc: "Left our account, with a payment reference on file.",
              },
              {
                stage: "verified",
                label: "Confirmed",
                value: totals.verifiedCents,
                desc: "Recipient has confirmed receipt. Evidence recorded.",
              },
              {
                stage: "outstanding",
                label: "Outstanding",
                value: totals.outstandingCents,
                desc: "Committed but not yet transferred. Our debt, stated plainly.",
              },
            ].map((s, i) => (
              <Reveal as="div" key={s.stage} delay={i * 60}>
                <div className="impact__stage" data-stage={s.stage}>
                  <span className="impact__stage-n">{formatMoney(s.value)}</span>
                  <span className="impact__stage-l">{s.label}</span>
                  <p className="impact__stage-d">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ---------- EMPTY STATE: the honest one ---------- */}
          {totals.isEmpty ? (
            <Reveal>
              <div className="empty" style={{ marginTop: "var(--s-8)" }}>
                <p className="display d5">NOTHING HAS BEEN SOLD YET.</p>
                <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "62ch" }}>
                  Chapter 001 has not opened, so no sales have been made, nothing has
                  accrued, and no funds have been transferred. Every figure above is
                  zero because zero is the truth.
                </p>
                <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "62ch" }}>
                  We are publishing this page before launch on purpose. The ledger,
                  the recipient verification process and the arithmetic checks exist
                  before the first sale, not after — so the first entry lands in a
                  system that was already built to be audited.
                </p>
              </div>
            </Reveal>
          ) : null}

          {/* ---------- ACCRUALS ---------- */}
          <Reveal>
            <p className="label" style={{ marginTop: "var(--s-9)" }}>
              <span className="label__index">02</span>
              <span className="label__name">Accrual periods</span>
            </p>
          </Reveal>

          {ledger.accruals.length === 0 ? (
            <p className="muted">No accrual periods recorded.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="visually-hidden">
                  Impact accrued per period from eligible sales
                </caption>
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Period</th>
                    <th scope="col">Chapter</th>
                    <th scope="col">Units</th>
                    <th scope="col">Eligible revenue</th>
                    <th scope="col">Committed ({ledger.commitmentPercent}%)</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.accruals.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>
                        {a.periodStart} → {a.periodEnd}
                      </td>
                      <td>{a.chapterSlug}</td>
                      <td>{a.unitsSold ?? "—"}</td>
                      <td>{formatMoney(a.eligibleRevenueCents)}</td>
                      <td>{formatMoney(a.accruedCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- TRANSFERS ---------- */}
          <Reveal>
            <p className="label" style={{ marginTop: "var(--s-9)" }}>
              <span className="label__index">03</span>
              <span className="label__name">Transfers</span>
            </p>
          </Reveal>

          {ledger.transfers.length === 0 ? (
            <p className="muted">No transfers recorded.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="visually-hidden">
                  Individual transfers to verified recipients
                </caption>
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Recipient</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Reference</th>
                    <th scope="col">Confirmed</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.transfers.map((t) => {
                    const recipient = getRecipient(t.recipientId);
                    return (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.date}</td>
                        <td>{recipient?.name ?? t.recipientId}</td>
                        <td>{formatMoney(t.amountCents)}</td>
                        <td>{t.status}</td>
                        <td>{t.reference}</td>
                        <td>{t.evidence?.recipientConfirmedOn ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- RECIPIENTS ---------- */}
          <Reveal>
            <p className="label" style={{ marginTop: "var(--s-9)" }}>
              <span className="label__index">04</span>
              <span className="label__name">Recipients</span>
            </p>
          </Reveal>

          {ledger.recipients.length === 0 ? (
            <p className="muted">
              No recipients verified yet. Recipients are named here only once we have
              verified them and they have agreed to be named.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="visually-hidden">Verified recipients</caption>
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Verification</th>
                    <th scope="col">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.recipients.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.location ?? "—"}</td>
                      <td>{r.verification.status}</td>
                      <td>{r.verification.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- METHOD ---------- */}
          <Reveal>
            <p className="label" style={{ marginTop: "var(--s-9)" }}>
              <span className="label__index">05</span>
              <span className="label__name">How this is kept honest</span>
            </p>
          </Reveal>

          <Reveal>
            <div className="prose stack" style={{ ["--flow" as string]: "var(--s-4)" }}>
              <p>
                <strong>Eligible sale</strong> means the product price actually
                received, excluding shipping, taxes and payment processing fees. The{" "}
                {site.impactPercent}% is calculated on that figure, and the figure is
                published alongside it so the arithmetic can be checked.
              </p>
              <p>
                <strong>The ledger is append-only.</strong> A settled entry is never
                edited. Mistakes are corrected by adding a correction entry, so the
                history of what we said stays visible.
              </p>
              <p>
                <strong>Automated checks run on every change.</strong> A validator
                enforces that accruals match the committed percentage, that we never
                record having transferred more than we owe, that every transfer names
                a recipient we have verified, and that a transfer can only be marked
                confirmed when recipient confirmation and a receipt reference exist.
                If any check fails, the ledger is not publishable.
              </p>
              <p>
                <strong>Recipients are verified before money moves</strong>, and named
                here only with their agreement. Where naming a recipient could put
                anyone at risk, we publish the category and the verification method
                instead of the name, and say that we have done so.
              </p>
              <p>
                <strong>Chapter reports.</strong> At the close of each chapter we
                publish units sold, eligible revenue, the amount committed, what was
                transferred, and what remains outstanding.
              </p>
              <p className="muted">
                If this page ever shows a headline number that our records cannot
                evidence, that is a failure of the brand, not a rounding issue. The
                system is deliberately built so the flattering number is the hard one
                to publish.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
