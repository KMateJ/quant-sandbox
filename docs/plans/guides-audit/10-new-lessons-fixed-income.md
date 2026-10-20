# 10 — New lessons: curve risk and key-rate durations; real rates and inflation

Status: done (2026-10-20) · Depends on: 07 · Suggested model: Sonnet · Est. size: L

## Why
"Duration and convexity" assumes a parallel shift and the yield-curve lab now animates steepeners and
butterflies (fixed-income-labs plan 06) with no lesson explaining what those shocks do to a bond or how
key-rate durations measure it. And nothing in the track distinguishes nominal from real rates, although
inflation-linked bonds and the Fisher relation are core material for an insurance and financial
mathematics programme.

## Current state (verified 2026-10-20)
- Plan 07 registered:
  - `curve-risk` · after `yield-curve` · labs `["yield-curve", "duration-convexity"]` · figure `key-rate-shocks` →
    `figures/wave4/KeyRateShocksFigure.tsx` · lesson `guides/curveRisk.ts` · keys `guideCurveRiskTitle/Desc`.
  - `real-rates-inflation` · after `credit-risk` (last) · labs `["bond-pricing", "tvm"]` · figure `fisher-real-rate` →
    `figures/wave4/FisherRealRateFigure.tsx` · lesson `guides/realRatesInflation.ts` · keys `guideRealRatesTitle/Desc`.
- Titles to cite (exact): EN "Bond prices and yields" / HU „Kötvényárak és hozamok”; EN "Duration and convexity" /
  HU „Duráció és konvexitás”; EN "Spot rates, forward rates and the yield curve" / HU „Azonnali kamatok, forward
  kamatok és a hozamgörbe”; EN "Immunization and duration matching" / HU „Immunizáció és durációillesztés”;
  EN "Interest, compounding and discounting" / HU „Kamat, kamatozás és diszkontálás”; EN "Credit risk: default
  probabilities and credit spreads" / HU `guideCreditRiskTitle` in `GuideWave3.hu.ts`.
- Maths to reuse: `src/lib/finance/bond.ts` (`BondSpec`, price / duration helpers — read its exports first),
  `src/features/yield-curve/yieldCurve.math.ts` (zero curve, discount factors; check how the lab defines the
  parallel / steepener / flattener / butterfly shocks and reuse the same shape functions so the lesson matches
  the lab), `src/features/guide/guide.interactive.immunizationShock.math.ts` (PV under a shifted curve).
- Figure conventions: see plan 08. Bar-style series: `WaterfallChart`/`Histogram` exist in `src/components/charts`;
  for key-rate bars a `Histogram`-like bar chart or `LineChart` with a step curve is acceptable.
- Harness: remove both ids from `PLACEHOLDER`.

## Goal
1. Two full lessons EN + HU (900–1400 words), ≥ 2 checks + 1 worked each.
2. Figures `key-rate-shocks` and `fisher-real-rate` on pure maths in `guide.wave4.math.ts` with tests.
3. Ids out of `PLACEHOLDER`; tests green.

## Non-goals
- No lab edits; no new shock types beyond those the yield-curve lab already has.

## Constraints
- As plan 08. Bond conventions as in the track: face 100, annual coupons, `D_mod = D/(1+y)`.

## Steps
### A. `curve-risk`
1. Maths:
   ```ts
   export type CurveShock = "parallel" | "steepener" | "flattener" | "butterfly";
   /// Zero curve after a shock of `bp` basis points with the lab's shape (reuse yieldCurve.math.ts shapes if exported).
   export function shockCurve(zeros: { t: number; z: number }[], shock: CurveShock, bp: number): { t: number; z: number }[]
   /// Price of annual-coupon cash flows off a zero curve (linear interpolation of zeros).
   export function priceOnCurve(cashflows: { t: number; cf: number }[], zeros: { t: number; z: number }[]): number
   /// Key-rate durations: −(ΔP/P)/Δy for a 1 bp bump of each key rate (2, 5, 10, 30y) with triangular interpolation.
   export function keyRateDurations(cashflows: { t: number; cf: number }[], zeros: { t: number; z: number }[], keys: number[]): number[]
   ```
   Defaults: upward-sloping zero curve (1y 3.0%, 2y 3.4%, 5y 3.9%, 10y 4.3%, 30y 4.6%), two bonds: 5y 4% coupon
   and a 2y/30y barbell with the same modified duration; shocks of ±50 bp.
2. Tests: key-rate durations sum to the modified duration within 2%; a parallel shock moves bullet and barbell
   almost equally while a steepener hurts the barbell more (sign assertions).
3. Figure: segmented control for the shock type, slider size (−100…+100 bp, default +50); chart: zero curve before
   and after; bars of the key-rate durations of bullet vs barbell; readouts: ΔP/P of each bond, sum of KRDs.
4. Outline: opening (builds on "Duration and convexity" and "Spot rates, forward rates and the yield curve");
   `h("Shapes of a curve move")`; `h("Pricing off the curve")` (`eq` for price from zeros);
   `h("Key-rate durations")` (definition; the sum property); `h("Bullet against barbell")` (same duration, different
   curve exposure; convexity remark citing "Immunization and duration matching"); worked: KRDs of the 5y bond at
   the figure defaults (compute in node) and ΔP/P for a steepener; checks: numeric (sum of KRDs), choice (which
   portfolio loses more in a steepener); Summary; `lab("/yield-curve", …)`.

### B. `real-rates-inflation`
1. Maths:
   ```ts
   /// Exact Fisher relation (1+i) = (1+r)(1+π) and its linear approximation.
   export function fisher(real: number, inflation: number): { nominalExact: number; nominalApprox: number }
   /// Price of an inflation-linked annual-coupon bond: real cash flows discounted at the real rate, equal to nominal
   /// cash flows indexed by (1+π)^t discounted at the nominal rate when Fisher holds exactly.
   export function linkerPrice(realCoupon: number, years: number, realRate: number): number
   /// Breakeven inflation from nominal and real yields (exact and approximate).
   export function breakeven(nominal: number, real: number): { exact: number; approx: number }
   ```
2. Tests: Fisher exact vs approx differ by rπ; `linkerPrice` equals the nominal-indexed price for any π; breakeven
   recovers π used to build the nominal yield.
3. Figure: sliders real rate (−1…4%, default 1%) and expected inflation (0…8%, default 3%); chart: nominal bond vs
   linker price against realised inflation (0–8%); readouts: nominal yield (Fisher), breakeven, the two prices at
   the chosen inflation.
4. Outline: opening (builds on "Interest, compounding and discounting" and "Bond prices and yields");
   `h("Nominal and real")`; `h("The Fisher relation")` (`eq` exact and approximate); `h("Discounting real cash flows")`
   (consistency rule: real flows at real rates, nominal at nominal — the classic error); `h("Inflation-linked bonds")`
   (indexed principal, real coupon, pricing); `h("Breakeven inflation")` (nominal minus real yield; what it tells
   you; a sentence on risk premia citing "Credit risk: default probabilities and credit spreads" for the spread
   analogy); worked: a 10-year 2% real coupon linker at 1% real with 3% inflation: price, first nominal coupon,
   indexed principal at maturity; checks: numeric (exact Fisher nominal for r = 2%, π = 3%: 5.06%), choice (which
   bond's nominal cash flows rise with inflation); Summary; `lab("/bond-pricing", …)`.

Then HU for both, remove ids from `PLACEHOLDER`, run tests, smoke.

## Acceptance criteria
- Readouts quoted equal the figures' defaults (Findings).
- Harness green with both ids removed; wave-4, checks, graph tests pass; smoke of both lessons EN + HU clean.

## Verification
```bash
npm run test:guide-wave4 && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/features/guide src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/fixed-income/curve-risk,/hu/guide/fixed-income/real-rates-inflation,/guide/fixed-income" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- The yield-curve lab's shock shapes live in its feature folder; import them only if they are in a pure `*.math.ts`
  without React; otherwise copy the shape definitions into `guide.wave4.math.ts` and say so in Findings (DRY
  exception, to keep guide maths independent of lab internals).
- `Spot rates …` defines zero rates; keep the same compounding convention (annual) in `priceOnCurve`.
- `curve-risk` sits before `treasury-futures` in reading order: do not cite "Bond futures and the cheapest-to-deliver".

## Findings (fill in during execution)
- Default readouts: `curve-risk` (5-year 4% bullet, +50 bp steepener): price 100.57, curve duration 4.46, key-rate durations 0.22 / 4.23 / 0 / 0 at 2 / 5 / 10 / 30y; barbell (91% in the 2y zero, 9% in the 30y zero) 1.75 / 0 / 0 / 2.70; steepener +0.74% bullet vs +0.59% barbell; parallel −2.20% vs −2.13%; flattener −0.74% vs −0.58%; butterfly −0.59% vs −0.32%. `real-rates-inflation` (real 1%, expected 3%, realised 5%, 10 years): nominal yield 4.03%, breakeven 3.00%, nominal bond real value 85.17, linker 100.00; worked linker (2% real coupon at 1%): 109.47.
- HU text (for owner review): both lessons in full (`curveRisk.ts`, `realRatesInflation.ts`, `hu` arrays) and the 25 new `gfW4…` figure strings in `GuideWave4.hu.ts`.
- Deviations and why: shock shapes are imported from `yieldCurve.math.ts` (pure, no React), so no copy was needed. In the lab's convention a positive "steepener" lowers the short rates; the lesson says so. The figure's nominal-vs-linker chart plots real value against realised inflation (both bonds are 100 at expected inflation) rather than a price, so the comparison is in one unit. Key-rate bars are drawn as a line over the four key maturities (`LineChart`).

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4), `docs/GUIDES_PLAN.md` §"Writing conventions" and
> `docs/plans/guides-audit/10-new-lessons-fixed-income.md`, and confirm plan 07 is marked done in the README (stop
> and report if not). Implement plan 10: write `curve-risk` and `real-rates-inflation` in EN and HU with checks and
> worked examples, build the `key-rate-shocks` and `fisher-real-rate` figures on pure maths with tests, and remove
> both ids from the harness `PLACEHOLDER` list. Edit only your lesson files, figure components and the wave-4
> math/test/string files. Run the verification commands (including the smoke test) and make them pass. Fill in
> Findings, set plan 10 to `done` in the README table, and summarise.
