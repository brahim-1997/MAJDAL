# IMPACT POLICY v1.0

**Commitment:** 15% of every eligible product sale supports people in Palestine.

This document is the definition behind that sentence. A percentage claim with
no definition is a marketing line; the definition is what makes it auditable.

## 1. What "15% of every eligible product sale" means

**Eligible sale** = the product price actually received, excluding shipping,
taxes/VAT, and payment processing fees. Refunded and chargeback orders are
reversed out of the period they were accrued in.

We publish the eligible revenue figure next to the contribution so anyone can
divide one by the other and check us.

We chose revenue, not profit, on purpose. "15% of profits" is the standard
dodge — profit is defined by the company claiming it, and can be zero.

**Eligible product** = every garment in `src/content/products.ts` with
`impactEligible: true`. Currently all four Chapter 001 garments. Any exclusion
must be stated on the product page itself, not buried here.

## 2. The four states, and why they are never added together

| State | Meaning | Publishable as impact delivered? |
| --- | --- | --- |
| **Committed (accrued)** | The 15% is owed. Money still with us. | **No** |
| **Transferred** | Sent, payment reference on file. | **No** |
| **Confirmed (verified)** | Recipient confirmed receipt; receipt ref on file. | **Yes** |
| **Outstanding** | Committed minus transferred. Our debt. | Published as debt |

The headline on `/impact` is **Confirmed** only. This is the whole design:
the number that flatters us is the hardest one to publish, because it requires
somebody else to confirm it.

## 3. Recipient verification

Before money moves, a recipient must have: a verified legal or organisational
identity; a named contact who confirms receipt; a stated route for funds; and
a record in the ledger with the verification method.

Where naming a recipient could expose anyone to risk, we publish the category
and the verification method instead of the name — **and we say that we have
done so.** We never imply a recipient is named when they are not.

**We do not** route funds through an intermediary that takes an undisclosed
cut, publish a recipient's name without consent, or use a recipient's imagery
in marketing without a separate written agreement.

## 4. Cadence

- **Monthly:** accrual entry per chapter for the closed month.
- **Per chapter close:** a public report — units, eligible revenue, committed,
  transferred, outstanding, recipients.
- **Transfers:** at minimum quarterly, and always within 90 days of accrual.
  If we miss that, the impact page says we missed it and why.

## 5. Controls

`scripts/validate-impact-ledger.mjs` runs in `npm run check` and must run in
CI. It fails the build if: accrual arithmetic doesn't match the committed
percentage; a transfer names a recipient not in the ledger; money is recorded
as sent to an unverified recipient; a transfer is marked confirmed without
recipient confirmation and a receipt reference; any entry is future-dated; or
ids collide. It warns if transfers exceed accruals.

The ledger is **append-only**. Settled entries are never edited; corrections
are new entries, so the history of what we claimed stays visible.

**Never commit example figures to `impact/ledger.json`.** A placeholder number
in that file is a false public claim the moment it deploys.

## 6. What we will never say

- "We've donated X" when X is accrued, not transferred and confirmed.
- "Proceeds go to…" without saying what proportion of what.
- "Supporting Palestine" as a claim with no recipient, no amount, no evidence.
- Any impact statement in a product caption that the ledger cannot back.

If we cannot evidence it, we do not say it. An unverifiable impact claim on a
Palestinian-inspired brand is not a marketing risk — it is exploitation of the
subject the brand claims to respect.
