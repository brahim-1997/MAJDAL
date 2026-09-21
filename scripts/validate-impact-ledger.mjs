#!/usr/bin/env node
/**
 * Impact ledger validator.
 *
 * The public impact page is only trustworthy if the ledger behind it cannot
 * drift. This runs in `npm run check` and should run in CI on every push.
 *
 * It enforces the invariants that keep the 15% claim honest:
 *   1. Accrual arithmetic matches the committed percentage.
 *   2. We never claim to have transferred more than we owe.
 *   3. Every transfer names a recipient that exists in the ledger.
 *   4. A transfer is only "verified" with recipient confirmation evidence.
 *   5. Money only moves to verified recipients.
 *   6. No future-dated entries, no duplicate ids.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Path is overridable so the invariants can be tested against fixtures.
const ledgerPath = process.argv[2] ?? join(root, "impact", "ledger.json");

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

let ledger;
try {
  ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
} catch (err) {
  console.error(`FATAL: cannot read or parse impact/ledger.json — ${err.message}`);
  process.exit(1);
}

const { commitmentPercent, recipients = [], accruals = [], transfers = [] } = ledger;

for (const field of [
  "policyVersion",
  "currency",
  "commitmentPercent",
  "lastUpdated",
]) {
  if (ledger[field] === undefined) fail(`missing required top-level field: ${field}`);
}

if (typeof commitmentPercent !== "number" || commitmentPercent <= 0) {
  fail(`commitmentPercent must be a positive number, got ${commitmentPercent}`);
}

const isIsoDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const today = new Date().toISOString().slice(0, 10);

const seen = new Map();
const uniqueId = (id, kind) => {
  if (!id) return fail(`${kind} entry is missing an id`);
  if (seen.has(id)) fail(`duplicate id ${id} (${kind} and ${seen.get(id)})`);
  seen.set(id, kind);
};

// --- Recipients ---
const recipientIds = new Set();
for (const r of recipients) {
  uniqueId(r.id, "recipient");
  recipientIds.add(r.id);
  if (!r.name) fail(`recipient ${r.id}: missing name`);
  if (!r.verification?.status) {
    fail(`recipient ${r.id}: missing verification.status`);
  } else if (r.verification.status === "verified") {
    if (!r.verification.method) {
      fail(`recipient ${r.id}: verified with no verification.method recorded`);
    }
    if (!r.verification.verifiedOn) {
      fail(`recipient ${r.id}: verified with no verifiedOn date`);
    }
  }
}

// --- Accruals ---
let totalAccrued = 0;
let totalEligibleRevenue = 0;
for (const a of accruals) {
  uniqueId(a.id, "accrual");
  if (!isIsoDate(a.periodStart)) fail(`accrual ${a.id}: periodStart must be YYYY-MM-DD`);
  if (!isIsoDate(a.periodEnd)) fail(`accrual ${a.id}: periodEnd must be YYYY-MM-DD`);
  if (isIsoDate(a.periodEnd) && a.periodEnd > today) {
    fail(`accrual ${a.id}: periodEnd ${a.periodEnd} is in the future`);
  }
  if (isIsoDate(a.periodStart) && isIsoDate(a.periodEnd) && a.periodStart > a.periodEnd) {
    fail(`accrual ${a.id}: periodStart is after periodEnd`);
  }
  if (!Number.isInteger(a.eligibleRevenueCents) || a.eligibleRevenueCents < 0) {
    fail(`accrual ${a.id}: eligibleRevenueCents must be a non-negative integer (minor units)`);
    continue;
  }
  if (!Number.isInteger(a.accruedCents) || a.accruedCents < 0) {
    fail(`accrual ${a.id}: accruedCents must be a non-negative integer (minor units)`);
    continue;
  }
  // The arithmetic that backs the public 15% claim. Allow 1 cent of rounding.
  const expected = Math.round((a.eligibleRevenueCents * commitmentPercent) / 100);
  if (Math.abs(a.accruedCents - expected) > 1) {
    fail(
      `accrual ${a.id}: accruedCents ${a.accruedCents} does not match ` +
        `${commitmentPercent}% of ${a.eligibleRevenueCents} (expected ${expected})`,
    );
  }
  totalAccrued += a.accruedCents;
  totalEligibleRevenue += a.eligibleRevenueCents;
}

// --- Transfers ---
let totalTransferred = 0;
let totalVerified = 0;
for (const t of transfers) {
  uniqueId(t.id, "transfer");
  if (!isIsoDate(t.date)) fail(`transfer ${t.id}: date must be YYYY-MM-DD`);
  else if (t.date > today) fail(`transfer ${t.id}: date ${t.date} is in the future`);

  if (!Number.isInteger(t.amountCents) || t.amountCents <= 0) {
    fail(`transfer ${t.id}: amountCents must be a positive integer (minor units)`);
  }
  if (!t.reference) fail(`transfer ${t.id}: missing payment reference`);
  if (/\b\d{9,}\b/.test(String(t.reference))) {
    fail(`transfer ${t.id}: reference looks like a raw account number — redact it`);
  }

  if (!recipientIds.has(t.recipientId)) {
    fail(`transfer ${t.id}: recipientId ${t.recipientId} is not in recipients[]`);
  } else {
    const r = recipients.find((x) => x.id === t.recipientId);
    if (r?.verification?.status !== "verified" && t.status !== "pending") {
      fail(
        `transfer ${t.id}: recipient ${t.recipientId} is not verified — ` +
          `money must not be recorded as sent to an unverified recipient`,
      );
    }
  }

  const validStatus = ["pending", "sent", "verified", "failed"];
  if (!validStatus.includes(t.status)) {
    fail(`transfer ${t.id}: status must be one of ${validStatus.join(", ")}`);
  }

  if (t.status === "verified") {
    if (!t.evidence?.recipientConfirmedOn) {
      fail(
        `transfer ${t.id}: status "verified" requires evidence.recipientConfirmedOn — ` +
          `we do not report delivered funds without recipient confirmation`,
      );
    }
    if (!t.evidence?.receiptRef) {
      fail(`transfer ${t.id}: status "verified" requires evidence.receiptRef`);
    }
  }

  if (t.status !== "failed" && Number.isInteger(t.amountCents) && t.amountCents > 0) {
    totalTransferred += t.amountCents;
    if (t.status === "verified") totalVerified += t.amountCents;
  }
}

// --- Cross-cutting invariant: never claim to have moved more than we owe ---
if (totalTransferred > totalAccrued) {
  warn(
    `transfers (${totalTransferred}) exceed accruals (${totalAccrued}). ` +
      `This is allowed only if MAJDAL deliberately gave more than the commitment. ` +
      `If so, say that explicitly on the impact page.`,
  );
}

const outstanding = totalAccrued - totalTransferred;
const fmt = (c) => `${(c / 100).toFixed(2)} ${ledger.currency ?? ""}`.trim();

console.log("MAJDAL IMPACT LEDGER — VALIDATION");
console.log("─".repeat(52));
console.log(`policy version      ${ledger.policyVersion}`);
console.log(`commitment          ${commitmentPercent}% of eligible sales`);
console.log(`recipients          ${recipients.length}`);
console.log(`accrual periods     ${accruals.length}`);
console.log(`transfers           ${transfers.length}`);
console.log("─".repeat(52));
console.log(`eligible revenue    ${fmt(totalEligibleRevenue)}`);
console.log(`accrued (owed)      ${fmt(totalAccrued)}`);
console.log(`transferred         ${fmt(totalTransferred)}`);
console.log(`verified delivered  ${fmt(totalVerified)}   <- the only publishable headline`);
console.log(`outstanding         ${fmt(outstanding)}`);
console.log("─".repeat(52));

if (
  accruals.length === 0 &&
  transfers.length === 0 &&
  recipients.length === 0
) {
  console.log(
    "Ledger is empty. Nothing has been sold and nothing has been transferred.\n" +
      "The impact page must say exactly that. Do not seed this file with\n" +
      "example figures — they would become false public claims.",
  );
}

for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s). Ledger is not publishable.`);
  process.exit(1);
}
console.log(`\nOK — ledger is internally consistent${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
