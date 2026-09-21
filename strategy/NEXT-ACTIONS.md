# NEXT ACTIONS

Ordered by what blocks what. P0 items block production entirely.

## P0 — Blocking (cultural integrity)

| # | Action | Owner | Blocks |
| --- | --- | --- | --- |
| 1 | Commission a named Palestinian cultural researcher to review `cultural-research/al-majdal-dossier.md`. **Paid, agreed in writing.** | Founder | Everything below |
| 2 | Answer Q4: is `ji'nneh u nar` appropriate as a commercial colourway name? | Reviewer | Colourway naming |
| 3 | Answer Q5: is it appropriate for MAJDAL to commercialise the term *Majdalawi*, and who should be consulted? | Reviewer | The entire ARCHIVE naming system |
| 4 | Native-speaker review of all Arabic: the wordmark مجدل, every fabric name, every transliteration | Native speaker | Any printed/embroidered Arabic |
| 5 | Read sources 5, 6, 7, 8, 11, 13 in full and reconcile against the dossier (see `SOURCES.md` retrieval gap) | Founder | `VERIFIED` tier integrity |

**Do not design garments around a name until items 2–4 are answered.**

## P1 — Foundation

| # | Action | Notes |
| --- | --- | --- |
| 6 | License display + Arabic typefaces; swap `--font-display` / `--font-arabic` in `src/app/tokens.css` | Nothing else changes. The current system-font stack is a placeholder and Arabic renders poorly without a real face. |
| 7 | Product photography — real bodies, hard light, plain ground | Replaces every placeholder frame |
| 8 | Sampling: 480 GSM loopback, 260 GSM jersey. Confirm real PO quantity | If it isn't 480, update `runSize` everywhere |
| 9 | Manufacturer selection + written labour standards | Cannot claim ethical production without it |
| 10 | Privacy policy + consent mechanism, then wire THE ROOTS registration | `JoinRoots.tsx` deliberately stores nothing until this exists |
| 11 | Commerce: checkout, tax, fulfilment | Keep the content layer as-is; add commerce beside it |
| 12 | Verify first impact recipient; add to ledger **before** the first sale | Recipient verification precedes revenue |

## P2 — Launch readiness

13. CI: run `npm run check` (typecheck + ledger validation + build) on every push.
14. Set the real domain in `src/content/site.ts`; flip `robots.ts` and the
    `robots` block in `layout.tsx` to indexable.
15. Open Graph images per route.
16. Accessibility audit with a screen reader — not just automated checks.
17. Lighthouse pass on a throttled mobile connection.
18. Book THE TABLE venue for city one.
19. Schedule the first THE READING and confirm (and pay) the guest.

## P3 — After Chapter 001

20. Chapter 002 subject, announced as a research question.
21. Explore a **paid** collaboration with a Majdalawi weaver or Palestinian
    craft institution — only with real money and real logistics attached, never
    as a content opportunity (see `PROTOCOL.md` §4).
22. Permanent line separate from chapters, so good garments can continue
    without faking scarcity.

## Standing rules

- An unanswered P0 is a production stop, not a risk to accept.
- Never commit example figures to `impact/ledger.json`.
- Never print a cultural claim that has not passed Gate 2.
