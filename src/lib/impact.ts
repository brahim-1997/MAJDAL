import ledgerJson from "../../impact/ledger.json";

/**
 * Reads impact/ledger.json and derives the public figures.
 *
 * The distinction this module exists to protect: `accrued` is money owed,
 * `transferred` is money sent, `verified` is money a recipient has confirmed
 * receiving. Only `verified` may be presented as impact delivered. The UI must
 * never sum these together into one flattering headline.
 */

export type RecipientVerificationStatus = "unverified" | "verified";
export type TransferStatus = "pending" | "sent" | "verified" | "failed";

export type Recipient = {
  id: string;
  name: string;
  location?: string;
  type?: string;
  publicUrl?: string;
  verification: {
    status: RecipientVerificationStatus;
    method: string;
    verifiedOn?: string;
    verifiedBy?: string;
    notes?: string;
  };
};

export type Accrual = {
  id: string;
  periodStart: string;
  periodEnd: string;
  chapterSlug: string;
  unitsSold?: number;
  eligibleRevenueCents: number;
  accruedCents: number;
  notes?: string;
};

export type Transfer = {
  id: string;
  date: string;
  recipientId: string;
  amountCents: number;
  status: TransferStatus;
  reference: string;
  evidence?: {
    receiptRef?: string;
    recipientConfirmedOn?: string;
    confirmedBy?: string;
    publicUrl?: string;
  };
  notes?: string;
};

export type Ledger = {
  policyVersion: string;
  currency: "EUR";
  commitmentPercent: number;
  lastUpdated: string;
  recipients: Recipient[];
  accruals: Accrual[];
  transfers: Transfer[];
};

export const ledger = ledgerJson as unknown as Ledger;

export type ImpactTotals = {
  /** Money owed under the commitment. */
  accruedCents: number;
  /** Money sent (excludes failed). */
  transferredCents: number;
  /** Money a recipient has confirmed receiving. The only publishable headline. */
  verifiedCents: number;
  /** Owed but not yet sent. */
  outstandingCents: number;
  eligibleRevenueCents: number;
  unitsSold: number;
  /** True when nothing has happened yet — the page must say so plainly. */
  isEmpty: boolean;
};

export function getImpactTotals(l: Ledger = ledger): ImpactTotals {
  const accruedCents = l.accruals.reduce((sum, a) => sum + a.accruedCents, 0);
  const eligibleRevenueCents = l.accruals.reduce(
    (sum, a) => sum + a.eligibleRevenueCents,
    0,
  );
  const unitsSold = l.accruals.reduce((sum, a) => sum + (a.unitsSold ?? 0), 0);

  const live = l.transfers.filter((t) => t.status !== "failed");
  const transferredCents = live.reduce((sum, t) => sum + t.amountCents, 0);
  const verifiedCents = live
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return {
    accruedCents,
    transferredCents,
    verifiedCents,
    outstandingCents: accruedCents - transferredCents,
    eligibleRevenueCents,
    unitsSold,
    isEmpty:
      l.accruals.length === 0 &&
      l.transfers.length === 0 &&
      l.recipients.length === 0,
  };
}

export const getRecipient = (id: string, l: Ledger = ledger) =>
  l.recipients.find((r) => r.id === id);

export function formatMoney(cents: number, currency = ledger.currency): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
