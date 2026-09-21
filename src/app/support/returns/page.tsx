import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: 'Returns',
  description: 'How returns work. Written before the first sale, not after a complaint.',
};

export default function Page() {
  return (
    <>
      <header className="phead">
        <div className="shell">
          <h1 className="display phead__title">RETURNS</h1>
          <p className="lead muted phead__lead">How returns work. Written before the first sale, not after a complaint.</p>
        </div>
      </header>

      <section className="section">
        <div className="shell">
          <div className="prose stack" style={{ ["--flow" as string]: "var(--s-8)" }}>
            <Reveal>
              <h2 className="display d4">Status</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>No orders can be placed yet, so there is nothing to return.</p>
            </Reveal>

            <Reveal>
              <h2 className="display d4">The policy this brand intends to run</h2>
              <p style={{ paddingTop: "var(--s-4)" }}>Unworn garments returnable within 30 days of delivery, in original condition with labels attached. Refund to the original payment method.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>A faulty garment is our problem, not yours: we cover return postage and replace or refund.</p>
              <p style={{ paddingTop: "var(--s-4)" }}>Returns reverse the impact accrual for that sale, because reporting a contribution on a sale that was refunded would overstate the number. That reversal is visible in the ledger.</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
