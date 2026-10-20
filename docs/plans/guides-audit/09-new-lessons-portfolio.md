# 09 — New lessons: portfolio constraints; estimating inputs

Status: done (2026-10-20) · Depends on: 07 · Suggested model: Sonnet · Est. size: L

## Why
The portfolio track derives the unconstrained frontier and CAPM but never says why nobody holds those
portfolios: short sales are banned or limited, and the inputs are estimates whose errors the optimiser
amplifies. Both lessons close the gap between the theory and what the Efficient Frontier lab shows when a
reader pins one frontier and changes the constraint set or the sample.

## Current state (verified 2026-10-20)
- Plan 07 registered, in this order after `risk-measures`:
  - `portfolio-constraints` · labs `["efficient-frontier", "portfolio-lab"]` · figure `constrained-frontier` →
    `figures/wave4/ConstrainedFrontierFigure.tsx` · lesson file `guides/portfolioConstraints.ts` · keys
    `guideConstraintsTitle/Desc`.
  - `input-estimation` · labs `["efficient-frontier", "risk-return"]` · figure `estimation-noise` →
    `figures/wave4/EstimationNoiseFigure.tsx` · lesson file `guides/inputEstimation.ts` · keys `guideEstimationTitle/Desc`.
- Titles to cite (exact): EN "Returns and volatility" / HU „Hozamok és volatilitás”; EN "Diversification and
  correlation" / HU „Diverzifikáció és korreláció”; EN "The efficient frontier and the capital market line" / HU
  „Hatékony front és tőkepiaci egyenes”; EN "CAPM, beta and the security market line" / HU „CAPM, béta és az
  értékpapír-piaci egyenes"; EN "Factor models and systematic risk" / HU `guideFactorModelsTitle` in
  `GuideWave3.hu.ts`; EN "Value at Risk and expected shortfall" / HU „Kockáztatott érték (VaR) és várható
  veszteség (ES)”. Each new lesson may cite the other only in the direction of reading order
  (`input-estimation` may cite "Portfolio constraints and the no-short-sales frontier"; not the reverse).
- Maths to reuse: `src/features/guide/guide.markets.math.ts` (two-asset frontier, CML), `src/features/efficient-frontier/`
  (look for the frontier solver the lab uses; reuse its minimum-variance routine if it is in a pure `*.math.ts`),
  `src/lib/math/random.ts` (`makeRng`, `nextNormal`) for resampling.
- Figure conventions: see plan 08. Scatter/line charts from `src/components/charts` (`ScatterChart`, `LineChart`).
- Harness: remove both ids from `PLACEHOLDER` when done.

## Goal
1. Two full lessons, EN + HU, 900–1400 words each, ≥ 2 checks + 1 worked each.
2. Two figures on pure maths in `guide.wave4.math.ts` (`// #region Portfolio constraints`, `// #region Input estimation`)
   with tests in `scripts/guide-wave4.test.mjs`.
3. Both ids out of `PLACEHOLDER`; all tests green.

## Non-goals
- No changes to the Efficient Frontier or Portfolio labs. No Black–Litterman (one sentence at most).

## Constraints
- As plan 08. Three assets at most in figures so the maths stays closed-form or a tiny grid search (no QP solver
  dependency; an executor may use a dense grid over the simplex for the no-short-sales frontier).

## Steps
### A. `portfolio-constraints`
1. Maths:
   ```ts
   /// Minimum-variance frontier of three assets with and without short sales, by grid search over weights (step 0.01).
   export function threeAssetFrontiers(mu: number[], sigma: number[], rho: number[][], allowShort: boolean): { sigma: number; mu: number; w: number[] }[]
   /// Maximum Sharpe ratio on a frontier and its weights.
   export function tangency(frontier: { sigma: number; mu: number; w: number[] }[], rf: number): { sharpe: number; w: number[]; sigma: number; mu: number }
   ```
   Defaults: μ = [6%, 9%, 12%], σ = [12%, 18%, 25%], ρ₁₂ = 0.3, ρ₁₃ = 0.1, ρ₂₃ = 0.5, r_f = 2%.
2. Tests: the unconstrained frontier lies on or above the constrained one at every μ; with short sales the
   tangency Sharpe is ≥ the constrained Sharpe; constrained weights sum to 1 and are ≥ 0.
3. Figure: segmented control "Short sales allowed / banned" or both drawn together (recommended: both, with the
   banned frontier in the accent colour); slider r_f (0–5%); readouts: tangency Sharpe with and without short
   sales, the shorted asset's weight in the unconstrained tangency, Sharpe cost of the ban.
4. Outline: opening (builds on "The efficient frontier and the capital market line"); `h("What a constraint is")`
   (budget, no short sales, position caps, sector limits); `h("The constrained frontier")` (why it lies inside; where
   the two coincide); `h("The cost of a constraint")` (Sharpe loss; the worked example computes it from the figure
   defaults); `h("Constraints as views")` (short-sale ban as a crude shrinkage; one sentence on Black–Litterman);
   checks: choice (constrained frontier can never be above the unconstrained one), numeric (weights of a
   two-asset constrained minimum-variance portfolio at a corner, e.g. all in asset 1 when ρ = 1 and σ₁ < σ₂);
   Summary; `lab("/efficient-frontier", …)`.

### B. `input-estimation`
1. Maths:
   ```ts
   /// Standard error of a mean estimated from n observations with volatility sigma, and of a volatility estimate.
   export function momentStandardErrors(sigma: number, n: number): { mean: number; vol: number }
   /// Sample means, volatilities and correlation from n seeded draws of two assets with true parameters.
   export function sampleMoments(seed: number, n: number, mu: number[], sigma: number[], rho: number): { mu: number[]; sigma: number[]; rho: number }
   /// Shrunk mean: (1 - k) * sample + k * grand mean.
   export function shrinkMeans(sample: number[], k: number): number[]
   ```
2. Tests: `momentStandardErrors(0.2, 100).mean` equals 0.02; `sampleMoments` with n = 100 000 recovers the true
   values within 1%; `shrinkMeans` with k = 1 gives the grand mean.
3. Figure: slider n (12–600 monthly observations, default 60) and shrinkage k (0–1, default 0); chart: the true
   two-asset frontier and 20 resampled frontiers (seeded) as faint lines; readouts: SE of the mean, spread of the
   estimated tangency weight across samples, average Sharpe lost.
4. Outline: opening (builds on "Returns and volatility" and "The efficient frontier and the capital market line");
   `h("Sample moments")`; `h("How wrong the estimates are")` (SE = σ/√n; the 20-year fact: 240 months give SE ≈ 1.2 pp
   for σ = 20%); `h("Error maximisation")` (the optimiser overweights lucky assets); `h("Shrinkage")` (towards the
   grand mean or the CAPM prior, citing "CAPM, beta and the security market line"); `h("Covariances are easier")`
   (relative error of variance vs mean; factor structure, citing "Factor models and systematic risk"); worked:
   SE of the mean for σ = 20%, n = 60, 240, 1200; 95% band; checks: numeric SE, choice (which input is hardest to
   estimate: expected returns); Summary; `lab("/efficient-frontier", …)`.

Then HU for both, remove ids from `PLACEHOLDER`, run tests, smoke.

## Acceptance criteria
- Default readouts quoted in the texts equal the figures' defaults (Findings).
- Harness green with both ids removed; `test:guide-wave4`, `test:guide-checks`, `test:guide-graph` pass.
- Smoke of both lessons in EN and HU: no problems.

## Verification
```bash
npm run test:guide-wave4 && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/features/guide src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/portfolio/portfolio-constraints,/hu/guide/portfolio/input-estimation,/guide/portfolio" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- A grid over three weights at step 0.01 is 5 151 points: fine. Do not add a QP library.
- Seeded randomness only (`makeRng`); unseeded figures make the quoted readouts wrong on every load.
- Two figures, two components, each ≤ 80 lines; share nothing through React state — share through the math file.

## Findings (fill in during execution)
- Default readouts. Constraints figure (mu 5/6/10%, sigma 10/18/24%, rho12 0.3, rho13 0.3, rho23 0.85, rf 2%): free tangency Sharpe 0.4164 (return 8.00%, vol 14.41%, weights 80/-50/70%), banned 0.3938 (6.65%, 11.81%, weights 67/0/33%), cost 0.0226 (5.4%). Estimation figure (true mu 4/10%, sigma 10/20%, rho 0, rf 2%; 60 months, k = 0): SE of the mean of asset 2 = 8.9 pp, middle half of the estimated weight in asset 1 = 47% to 97% (true 50%), average Sharpe lost 0.160 (true optimum 0.447); k = 0.5 gives 0.097; 600 months gives 0.020.
- HU text (for owner review): the lesson files `portfolioConstraints.ts` and `inputEstimation.ts` (HU parts) and the new `gfW4*` figure strings (risk-free rate, short-sales allowed/banned, Sharpe labels, months, shrinkage, estimated frontiers, weight spread...).
- Deviations and why: (1) The plan's default assets (mu 6/9/12%, rho 0.3/0.1/0.5) have an unconstrained tangency with no short position, so the ban would cost nothing; I chose assets with a strongly correlated pair (rho23 = 0.85) where the free tangency shorts asset 2. (2) The plan's claim "240 months give SE of about 1.2 pp for sigma = 20%" is wrong: the annual SE is sigma/sqrt(years) = 4.5 pp after 20 years (1.2 pp is not a monthly or annual figure). The lesson uses 5, 20 and 100 years. (3) The weight spread is reported as the middle half (quartiles), because the raw standard deviation of the unconstrained tangency weight is dominated by a few extreme samples (one reached 351). (4) The estimated tangency weight is unconstrained and sometimes huge; that is the point of the "error maximisation" section. (5) EN lessons are 875 and 865 words, HU 719 and 725, a little below the 900 target (audit bound 600-2300 met). (6) No branch was created (shared working tree).

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4), `docs/GUIDES_PLAN.md` §"Writing conventions" and
> `docs/plans/guides-audit/09-new-lessons-portfolio.md`, and confirm plan 07 is marked done in the README (stop and
> report if not). Implement plan 09: write `portfolio-constraints` and `input-estimation` in EN and HU with checks
> and worked examples, build their two figures on pure, seeded maths with tests, and remove both ids from the
> harness `PLACEHOLDER` list. Edit only your lesson files, figure components and the wave-4 math/test/string files.
> Run the verification commands (including the smoke test) and make them pass. Fill in Findings, set plan 09 to
> `done` in the README table, and summarise.
