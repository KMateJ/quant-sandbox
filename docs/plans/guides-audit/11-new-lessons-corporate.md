# 11 — New lessons: capital budgeting under uncertainty; dividend policy

Status: done (2026-10-20) · Depends on: 07 · Suggested model: Sonnet · Est. size: L

## Why
The corporate track computes NPV as a single number and never asks how uncertain it is; the Monte Carlo
lab and the NPV lab exist but no lesson joins them. And the track covers capital structure (Modigliani–
Miller) without the companion result on payout policy or the dividend discount model that DCF valuation
quietly relies on (the Gordon growth formula appears in "Discounted cash flow valuation" and "Relative
valuation with multiples" without its own derivation).

## Current state (verified 2026-10-20)
- Plan 07 registered:
  - `capital-budgeting-risk` · after `npv-irr` · labs `["npv-irr", "monte-carlo"]` · figure `npv-distribution` →
    `figures/wave4/NpvDistributionFigure.tsx` · lesson `guides/capitalBudgetingRisk.ts` · keys `guideProjectRiskTitle/Desc`.
  - `dividend-policy` · after `capital-structure` · labs `["valuation", "capital-structure"]` · figure `payout-ddm` →
    `figures/wave4/PayoutDdmFigure.tsx` · lesson `guides/dividendPolicy.ts` · keys `guideDividendPolicyTitle/Desc`.
- Titles to cite (exact): EN "Net present value and internal rate of return" / HU „Nettó jelenérték és belső
  megtérülési ráta”; EN "Interest, compounding and discounting" / HU „Kamat, kamatozás és diszkontálás”;
  EN "Annuities, perpetuities and loan amortization" / HU `guideAnnuitiesTitle` in `Guide.hu.ts`; EN "The weighted
  average cost of capital" / HU „Súlyozott átlagos tőkeköltség”; EN "Capital structure and the Modigliani–Miller
  theorems" / HU „Tőkeszerkezet és a Modigliani–Miller-tételek”; EN "Returns and volatility" / HU „Hozamok és
  volatilitás”. `capital-budgeting-risk` precedes `wacc`: it must not cite WACC or DCF by title in the body.
  `dividend-policy` precedes `dcf-valuation`: do not cite "Discounted cash flow valuation" in the body (closing note
  may name it as a later lesson).
- Maths to reuse: `src/features/guide/guide.interactive.cashflowBuilder.math.ts` (NPV/IRR of a cash-flow list),
  `src/features/npv-irr/*.math.ts` (check exports), `src/lib/math/random.ts` (`makeRng`, `nextNormal`),
  `src/components/charts` `Histogram` for the NPV distribution.
- Harness: remove both ids from `PLACEHOLDER`.

## Goal
1. Two full lessons EN + HU (900–1400 words), ≥ 2 checks + 1 worked each.
2. Figures `npv-distribution` and `payout-ddm` on pure, seeded maths in `guide.wave4.math.ts` with tests.
3. Ids out of `PLACEHOLDER`; tests green.

## Non-goals
- No lab edits. No tax-shield or leverage content (that is "Capital structure …"). No clientele/signalling theory
  beyond one paragraph.

## Constraints
- As plan 08. Seeded randomness only.

## Steps
### A. `capital-budgeting-risk`
1. Maths:
   ```ts
   export type ProjectInputs = { investment: number; years: number; units: number; price: number; unitCost: number; fixedCost: number; rate: number };
   /// NPV of a level project: annual cash flow (units·(price − unitCost) − fixedCost) for `years`, minus the investment.
   export function projectNpv(p: ProjectInputs): number
   /// NPV after changing one input by ±pct, for the sensitivity table.
   export function sensitivity(p: ProjectInputs, key: keyof ProjectInputs, pct: number): { low: number; high: number }
   /// Break-even value of one input (NPV = 0), by bisection.
   export function breakEven(p: ProjectInputs, key: "units" | "price" | "unitCost"): number
   /// Seeded Monte Carlo of NPV with units ~ N(mean, sd) and price ~ N(mean, sd), truncated at 0.
   export function npvSimulation(p: ProjectInputs, sd: { units: number; price: number }, n: number, seed: number): { npvs: number[]; mean: number; probLoss: number }
   ```
   Defaults: investment 1 000, 5 years, 100 units at 15 with unit cost 8, fixed cost 200, rate 8%; sd units 20, sd
   price 1.5; n = 5 000.
2. Tests: `projectNpv` matches a hand calculation (annuity factor from "Annuities …"); `breakEven("units")` gives
   NPV ≈ 0 when substituted; `npvSimulation` with zero sds returns the deterministic NPV and probLoss 0 or 1.
3. Figure: sliders sd of units (0–40) and sd of price (0–3); histogram of the simulated NPVs with a solid marker
   at 0; readouts: deterministic NPV, mean simulated NPV, P(NPV < 0), 5th percentile.
4. Outline: opening (builds on "Net present value and internal rate of return" and "Annuities, perpetuities and
   loan amortization"); `h("One number hides the risk")`; `h("Sensitivity analysis")` (one input at a time, ±10%,
   a table as a `list`); `h("Break-even analysis")`; `h("Scenario analysis")` (base/best/worst with joint moves);
   `h("Monte Carlo simulation")` (distributions on inputs; what the histogram shows; citing "Returns and
   volatility" for the standard deviation); `h("What to do with the distribution")` (probability of loss, downside,
   real options as a later lesson in the closing note); worked: NPV at base, then ±10% units; checks: numeric
   (break-even units), choice (sensitivity varies one input at a time); Summary; `lab("/npv-irr", …)`.

### B. `dividend-policy`
1. Maths:
   ```ts
   /// Gordon growth price D1/(k − g) with g = retention × ROE; returns NaN when g ≥ k.
   export function gordonPrice(eps: number, payout: number, roe: number, k: number): { g: number; d1: number; price: number }
   /// Price against payout ratio for the figure (0.05 … 1).
   export function payoutSeries(eps: number, roe: number, k: number): { payout: number; price: number; g: number }[]
   /// Present value of growth opportunities: price minus EPS/k.
   export function pvgo(price: number, eps: number, k: number): number
   ```
   Defaults: EPS 5, ROE 12%, k 10%, payout 40%.
2. Tests: when ROE = k the price is EPS/k for every payout (MM irrelevance in the model); price rises with
   retention iff ROE > k; `pvgo` is 0 when ROE = k.
3. Figure: sliders ROE (4–20%) and k (6–14%); chart: price against payout ratio with a solid marker at the chosen
   payout; readouts: g, D₁, price, PVGO.
4. Outline: opening (builds on "Interest, compounding and discounting", "Annuities, perpetuities and loan
   amortization" and "Capital structure and the Modigliani–Miller theorems"); `h("Dividends and the dividend
   discount model")` (`eq` P₀ = Σ D_t/(1+k)^t); `h("The Gordon growth formula")`; `h("Growth from retained
   earnings")` (g = b·ROE; the trade-off); `h("Payout irrelevance")` (MM with perfect markets: the ROE = k case;
   homemade dividends; buybacks); `h("When payout matters")` (taxes, signalling, agency, one paragraph each);
   `h("The present value of growth opportunities")`; worked: price at the defaults step by step (g, D₁, P₀, PVGO);
   checks: numeric (price when payout = 100%: EPS/k = 50), choice (irrelevance needs ROE = k and no frictions);
   Summary; `lab("/valuation", …)`.

Then HU for both, remove ids from `PLACEHOLDER`, run tests, smoke.

## Acceptance criteria
- Readouts quoted equal the figures' defaults (Findings).
- Harness green with both ids removed; wave-4, checks, graph tests pass (no forward citations); smoke clean.

## Verification
```bash
npm run test:guide-wave4 && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/features/guide src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/corporate/capital-budgeting-risk,/hu/guide/corporate/dividend-policy,/guide/corporate" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- `g ≥ k` makes the Gordon price infinite: cap the slider ranges so the default region is valid and show "—" in
  readouts otherwise (`fmt` helpers handle NaN? check `figureFormat.ts`; if not, guard in the component).
- The NPV histogram needs the `Histogram` chart's data shape; read `src/components/charts/HistogramInner.tsx` props
  before coding.
- Track order: `capital-budgeting-risk` is lesson 4 (after npv-irr) and must not cite WACC; use "the discount rate r"
  as the earlier lessons do.

## Findings (fill in during execution)
- Default readouts (computed in node from `guide.wave4.corporate.math.ts`, asserted in `scripts/guide-wave4.test.mjs`):
  - `npv-distribution` (5,000 draws, seed 1, sd units 20, sd price 1.5): base NPV 996.36, mean simulated 993.77,
    P(NPV < 0) 11.0% (0.1096), 5th percentile −271.85. Annuity factor 3.9927. ±10% table: units 716.87/1,275.84,
    price 397.45/1,595.26, unit cost 1,315.77/676.94, fixed cost 1,076.21/916.50, investment 1,096.36/896.36,
    rate 1,039.17/954.96. Break-even units 64.35, price 12.50, unit cost 10.50. Scenarios: best (120 @ 16.50)
    2,274.02, worst (80 @ 13.50) −41.75.
  - `payout-ddm` (EPS 5, ROE 12%, k 10%, payout 40%): g 7.20%, D₁ 2.00, P₀ 71.43, PVGO 21.43; payout 100% → 50.
- HU text (for owner review): both lessons in full — `capital-budgeting-risk` (checks `capital-budgeting-risk/one-at-a-time`,
  `capital-budgeting-risk/break-even-units`) and `dividend-policy` (checks `dividend-policy/full-payout`,
  `dividend-policy/irrelevance`); HU figure strings `gfW4FieldSdUnits` … `gfW4Pvgo` in `GuideWave4.hu.ts`.
- Deviations and why:
  - Maths in a new `src/features/guide/guide.wave4.corporate.math.ts` instead of `guide.wave4.math.ts`, so the
    concurrent plan 09 session editing that file is not overwritten. Tests appended as one region to
    `scripts/guide-wave4.test.mjs`.
  - `gordonPrice` treats `eps` as next-year EPS (D₁ = payout · EPS₁); with EPS₀·(1+g) the ROE = k irrelevance would
    not hold exactly. `npvSimulation` also returns `p5` (the 5th-percentile readout).
  - Payout figure has a third slider (payout) for the "marker at the chosen payout"; prices above 4·EPS/k and g ≥ k
    are left off the chart, readouts show "–" (`fmt`).
  - The two figure titles `gfW4NpvDistributionTitle` / `gfW4PayoutDdmTitle` were renamed from "Figure: <lesson title>".
  - EN words: 1,289 / 1,311.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4), `docs/GUIDES_PLAN.md` §"Writing conventions" and
> `docs/plans/guides-audit/11-new-lessons-corporate.md`, and confirm plan 07 is marked done in the README (stop and
> report if not). Implement plan 11: write `capital-budgeting-risk` and `dividend-policy` in EN and HU with checks
> and worked examples, build the `npv-distribution` and `payout-ddm` figures on pure, seeded maths with tests, and
> remove both ids from the harness `PLACEHOLDER` list. Edit only your lesson files, figure components and the
> wave-4 math/test/string files. Run the verification commands (including the smoke test) and make them pass.
> Fill in Findings, set plan 11 to `done` in the README table, and summarise.
