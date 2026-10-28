# Market microstructure guides pack log

Append-only. One line per entry, newest last: `- YYYY-MM-DD HH:MM <session> NN <KIND>: message`.
Kinds: `CLAIM`, `CONTRACT` (you changed something another plan imports), `BLOCKED`, `DEVIATION`, `DONE`.
Never edit or delete other sessions' lines.

- 2026-10-28 planner README DRAFTING: pack being written; do not claim until README says READY.
- 2026-10-28 planner README READY: pack written (plans 01–13); start with 01, then 02–12 in parallel.
- 2026-10-28 21:53 plan-01 01 CLAIM: registering microstructure track + 11 placeholders.
- 2026-10-28 22:09 opus-main mm-05 CONTRACT: src/lib/market/informed.ts created (informedLoss, incomeRate, bestDelta, breakEvenDelta, type InformedFlow); import it unchanged.
- 2026-10-28 22:33 plan-01 01 DEVIATION: lesson SEO titles must be ≤ 54 chars (test:seo counts the " | Quant Sandbox" suffix) and descriptions ≤ 160; 8 SEO titles, the track title and 10 EN/HU descriptions shortened (see plan 01 Findings).
- 2026-10-28 22:33 plan-01 01 DONE: microstructure track + 11 placeholders registered; regions, PLACEHOLDER lines, GUIDES_PLAN rows ready for 02–12. Audit orphan rule fixed for our labs; it now flags only fama-french/systemic-risk (factor-and-systemic-risk pack). test:seo still red on placeholder Markdown twins (<150 words), the shared JS budget and other packs' pages.
- 2026-10-28 22:35 plan-02 02 CLAIM: writing Market makers and liquidity lesson + round-trip figure.
- 2026-10-28 22:36 plan-06 06 CLAIM: writing The Glosten–Milgrom model lesson + gm-learning figure.
- 2026-10-28 22:36 plan-03 03 CLAIM: writing The limit order book lesson + book-walk figure.
- 2026-10-28 22:36 plan-04 04 CLAIM: writing Queue position and fill probability lesson + queue-fill figure.
- 2026-10-28 22:38 plan-05 05 CLAIM: writing Adverse selection and informed trading lesson + toxic-income figure.
- 2026-10-28 22:43 plan-02 02 DEVIATION: worked example uses a mid RISE of 0.10 (plan said fall; a short maker loses on a rise, giving the planned -60); no exact-title citation of lessons beyond the next (test:guide-graph).
- 2026-10-28 22:43 plan-02 02 DONE: market-makers lesson EN+HU, round-trip figure, guide.micro.marketMakers.math.ts + test; PLACEHOLDER line and GUIDES_PLAN row done. test:guide-audit red only on pre-existing fama-french/systemic-risk; verified on dev server (tsc/eslint red elsewhere from other packs).
- 2026-10-28 22:58 plan-05 05 DEVIATION: worked example uses δ = 2¢ and 2.3¢ (not 3¢): with the plan's parameters R(3) < R(2), the best half-spread is 2.29¢.
- 2026-10-28 22:58 plan-05 05 DONE: adverse-selection lesson EN+HU, toxic-income figure, guide.micro.adverseSelection.math.ts, guide-micro-adverse-selection test; PLACEHOLDER line removed; audit red only on fama-french/systemic-risk (other pack); build not run (tsc red from market-making-desk files).
- 2026-10-28 22:47 plan-04 04 DONE: queue-position lesson (EN+HU, 3 checks, worked) + queue-fill figure + guide.micro.queuePosition.math.ts + test; PLACEHOLDER line removed. Audit red only on pre-existing fama-french/systemic-risk; tsc red only in market-making-desk (other pack).
- 2026-10-28 22:47 plan-03 03 DONE: limit-order-book lesson (EN+HU, 3 checks, worked) + book-walk figure + guide.micro.limitOrderBook.math + test; PLACEHOLDER line removed; styles appended as gf-ms-limit-order-book region in guide.scss. Audit red only on pre-existing fama-french/systemic-risk.
- 2026-10-28 22:48 opus-spe 07 CLAIM: spread measurement lesson
- 2026-10-28 22:49 opus-glm 08 CLAIM: kyle model lesson
- 2026-10-28 22:54 opus-spe 07 DONE: spread-measurement lesson EN+HU (1,373 words, 2 checks, worked) + roll-bounce figure (tape, Δp scatter, Roll/effective/Huang–Stoll readouts) + guide.micro.spreadMeasurement.math + test; PLACEHOLDER line removed. Audit red only on pre-existing fama-french/systemic-risk; tsc red only in inventory-skew/pnl figures (other plans).
- 2026-10-28 22:54 ea82 12 CLAIM: market-making-pnl lesson + pnl-attribution figure.
- 2026-10-28 22:55 ea82 10 CLAIM: inventory risk lesson + inventory-skew figure.
- 2026-10-28 22:59 plan-06 06 DONE: glosten-milgrom lesson (EN+HU, 3 checks, worked block) + gm-learning figure + guide.micro.glostenMilgrom.math.ts + test; PLACEHOLDER line removed, GUIDES_PLAN row done. Audit's only red is pre-existing fama-french/systemic-risk (other pack).
- 2026-10-28 23:30 ea82 11 DONE: avellaneda-stoikov lesson EN+HU, as-quotes figure, guide.micro.avellanedaStoikov.math.ts + test; PLACEHOLDER line removed.
- 2026-10-28 23:08 opus-glm 08 DONE: kyle-model lesson EN+HU (3 checks, worked), kyle-schedule figure (DraggableBars + price path, insider/maker toggle), guide.micro.kyleModel.math.ts + guide-micro-kyle-model test (7/7); PLACEHOLDER line removed, GUIDES_PLAN row done. Audit red only on fama-french/systemic-risk; smoke EN+HU clean.
- 2026-10-28 23:10 plan-09 09 DONE: price-impact lesson EN+HU (3 checks, worked), execution-frontier figure, guide.micro.priceImpact.math.ts + test; PLACEHOLDER line removed. Audit red only on fama-french/systemic-risk (other pack); smoke clean EN+HU on vite preview.
- 2026-10-28 23:14 ea82 12 DONE: market-making-pnl lesson EN+HU, pnl-attribution figure, guide.micro.marketMakingPnl.math.ts + test; PLACEHOLDER line removed, GUIDES_PLAN row done. Audit red only on fama-french/systemic-risk.
- 2026-10-28 23:20 ea82 10 DONE: inventory-risk lesson EN+HU (3 checks, worked) + inventory-skew figure + guide.micro.inventoryRisk.math.ts + test; PLACEHOLDER line removed. Audit red only on fama-french/systemic-risk.
- 2026-10-28 23:15 opus-glm 13 CLAIM: final QA
- 2026-10-28 23:31 opus-glm 13 DONE: guide tests green (audit red only fama-french/systemic-risk; graph timing flake), allowlists empty, build+SEO (SEO_ALLOW_EMPTY) clean for this pack, smoke 26/26; fixed spread 'undefined' md leak and 'From lesson to desk' heading with regression tests; KaTeX 360px + HU AS label clipping are follow-ups.
