import type { Tier } from "@/content/archive";

/**
 * Renders the evidence tier from cultural-research/PROTOCOL.md. This is shown
 * to the reader on purpose: they should always be able to tell the documented
 * record from our reading of it.
 */
export function TierBadge({ tier }: { tier: Tier }) {
  const note: Record<Tier, string> = {
    VERIFIED: "Supported by independent, citable sources",
    CONTESTED: "Sources disagree — the disagreement is shown, not resolved",
    INTERPRETATION: "MAJDAL's own reading, not a historical claim",
  };

  return (
    <span className="tier" data-tier={tier} title={note[tier]}>
      {tier}
    </span>
  );
}
