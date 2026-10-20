# 12 — New lessons: law of large numbers and CLT; correlated Brownian motions

Status: done (2026-10-20) · Depends on: 07 · Suggested model: Sonnet · Est. size: L

## Why
The stochastic track jumps from random walks to probability spaces and later uses "the central limit
theorem" and "the law of large numbers" (random-walks, monte-carlo-pricing, brownian-properties mention
them) without ever stating them; the Studio has a CLT lab (`/stochastic-models/clt`) with no theory lesson.
And the Heston lab and basket Monte Carlo need correlated Brownian motions, which no lesson constructs.

## Current state (verified 2026-10-20)
- Plan 07 registered:
  - `law-of-large-numbers-clt` · after `random-walks` · labs `["stochastic-models", "monte-carlo"]` · figure
    `clt-convergence` → `figures/wave4/CltConvergenceFigure.tsx` · lesson `guides/lawOfLargeNumbersClt.ts` · keys
    `guideLlnCltTitle/Desc`.
  - `correlated-brownian-motions` · after `sde-simulation` · labs `["heston", "monte-carlo"]` · figure
    `correlated-paths` → `figures/wave4/CorrelatedPathsFigure.tsx` · lesson `guides/correlatedBrownianMotions.ts` ·
    keys `guideCorrelatedBmTitle/Desc`.
- Reading order of the track after plan 07: random-walks → **law-of-large-numbers-clt** → probability-spaces →
  filtrations → martingales → brownian-properties → reflection-principle → brownian-bridge → ito-integral →
  ito-lemma → feynman-kac → change-of-measure → monte-carlo-pricing → sde-simulation →
  **correlated-brownian-motions** → mean-reversion → jump-diffusion.
- Titles to cite (exact): EN "Random walks and Brownian motion" / HU „Véletlen bolyongás és Brown-mozgás”;
  EN "Returns and volatility" / HU „Hozamok és volatilitás”; EN "Properties of Brownian motion" / HU „A Brown-mozgás
  tulajdonságai”; EN "The Itô integral" / HU „Az Itô-integrál”; EN "Itô's lemma" / HU „Az Itô-lemma”;
  EN "Simulating SDEs: the Euler–Maruyama scheme" / HU „SDE-k szimulációja: az Euler–Maruyama-séma”; EN "Monte Carlo
  option pricing" / HU „Monte Carlo-opcióárazás”; EN "Stochastic volatility and the Heston model" / HU
  `guideStochVolTitle` in `Guide.hu.ts` (cross-track, fine); EN "Diversification and correlation" / HU „Diverzifikáció
  és korreláció”. `law-of-large-numbers-clt` is lesson 2 of the track: it may cite only "Random walks and Brownian
  motion" and cross-track lessons in the body (probability spaces come later; the closing note may name
  "Probability spaces, σ-algebras and random variables" as the next lesson).
- Maths to reuse: `src/features/stochastic-models/clt.math.ts` (`cltLevelSamples`, `sampleMoments` — see
  `scripts/clt.test.mjs` for usage), `src/lib/math/random.ts` (`makeRng`, `nextNormal`), `src/lib/stats/distributions.ts`.
- Figure conventions: see plan 08. `Histogram` and `ScatterChart` in `src/components/charts`.
- Harness: remove both ids from `PLACEHOLDER`.

## Goal
1. Two full lessons EN + HU (1000–1600 words; rigour like the other stochastic lessons), ≥ 2 checks + 1 worked each.
2. Figures `clt-convergence` and `correlated-paths` on pure, seeded maths in `guide.wave4.math.ts` with tests.
3. Ids out of `PLACEHOLDER`; tests green.

## Non-goals
- No Studio or lab edits. No multi-dimensional Girsanov. No copulas beyond one sentence.

## Constraints
- As plan 08. Statements of theorems with hypotheses (i.i.d., finite variance), as the user asked for rigour in
  this track; proofs sketched where short (Chebyshev for the weak LLN), cited otherwise.

## Steps
### A. `law-of-large-numbers-clt`
1. Maths:
   ```ts
   export type SourceDist = "uniform" | "exponential" | "bernoulli";
   /// n-sample means of a source distribution, standardised, `m` seeded replications; plus mean and sd of the means.
   export function standardisedMeans(dist: SourceDist, n: number, m: number, seed: number): { z: number[]; mean: number; sd: number }
   /// Running sample mean along one seeded path of `n` draws, for the LLN panel.
   export function runningMean(dist: SourceDist, n: number, seed: number): number[]
   /// Maximum gap between the empirical CDF of `z` and the standard normal CDF (Kolmogorov distance).
   export function normalDistance(z: number[]): number
   ```
   Reuse `clt.math.ts` if its `cltLevelSamples` fits; otherwise implement with `makeRng`.
2. Tests: `standardisedMeans` has mean ≈ 0, sd ≈ 1 for n = 30, m = 20 000 (tolerance 0.03); `normalDistance`
   decreases from n = 1 to n = 30 for the exponential source; `runningMean` ends within 3σ/√n of the true mean.
3. Figure: segmented control for the source distribution; slider n (1–100, default 10); histogram of standardised
   means against the standard normal density; small readouts: Kolmogorov distance, sd of the raw mean vs σ/√n.
4. Outline: opening (builds on "Random walks and Brownian motion" and "Returns and volatility"); `h("Averages of
   independent draws")`; `h("The weak law of large numbers")` (statement; Chebyshev proof in three `eq`s);
   `h("The strong law")` (statement only; what "almost surely" adds; cites nothing later); `h("The central limit
   theorem")` (statement with hypotheses; the √n scaling; the standardised sum); `h("How fast: the Berry–Esseen
   bound")` (statement; skewed sources converge slower — what the figure shows); `h("Where the theorems are used")`
   (Monte Carlo standard error; the Brownian limit of the walk; the closing note previews "Probability spaces,
   σ-algebras and random variables"); worked: standard error of a Monte Carlo mean with σ = 2, n = 10 000; the 95%
   band; the n needed to halve it; checks: numeric (n to halve the SE: ×4), choice (which hypothesis the CLT needs:
   finite variance); Summary; `lab("/stochastic-models/clt", …)`.

### B. `correlated-brownian-motions`
1. Maths:
   ```ts
   /// Two correlated Brownian paths on a grid: W1 and W2 = ρ W1 + sqrt(1 − ρ²) W⊥, seeded.
   export function correlatedPaths(rho: number, steps: number, T: number, seed: number): { t: number; w1: number; w2: number }[]
   /// Cholesky factor of a 2×2 or 3×3 correlation matrix (lower triangular), or null if not positive definite.
   export function cholesky(corr: number[][]): number[][] | null
   /// Sample correlation of the increments of two paths.
   export function incrementCorrelation(paths: { w1: number; w2: number }[]): number
   ```
2. Tests: `cholesky([[1, ρ], [ρ, 1]])` is `[[1, 0], [ρ, √(1−ρ²)]]`; L·Lᵀ reproduces a 3×3 matrix; `cholesky` returns
   null for ρ = 1.2; `incrementCorrelation` of 20 000-step paths is within 0.02 of ρ.
3. Figure: slider ρ (−0.95…0.95, default −0.7, the Heston sign); chart: the two paths; a second small scatter of
   increments or a readout only (keep the component ≤ 80 lines: one chart + readouts); readouts: sample ρ, the
   Cholesky entries, quadratic covariation ⟨W₁, W₂⟩_T = ρT.
4. Outline: opening (builds on "Properties of Brownian motion", "Simulating SDEs: the Euler–Maruyama scheme" and
   "Diversification and correlation"); `h("Two Brownian motions with correlation ρ")` (definition via d⟨W₁, W₂⟩ = ρ dt;
   construction from independent ones); `h("The Cholesky factor")` (2×2 explicitly, n×n stated; positive
   definiteness); `h("The two-dimensional Itô rule")` (cites "Itô's lemma"; the cross term ρ σ₁ σ₂ ∂²f/∂x∂y);
   `h("Where correlation enters")` (Heston: dS and dv with ρ < 0 — cites "Stochastic volatility and the Heston
   model"; basket / spread options; portfolio GBM); `h("Simulating correlated assets")` (Euler with the factor;
   cites "Monte Carlo option pricing"); worked: Cholesky of ρ = −0.7, then the second path's increment from two
   standard normals (0.8, −0.3); product rule check d(W₁W₂) = W₂ dW₁ + W₁ dW₂ + ρ dt; checks: numeric (√(1−ρ²) for
   ρ = 0.6: 0.8), choice (sign of ρ in Heston that produces the equity skew: negative); Summary; `lab("/heston", …)`.

Then HU for both, remove ids from `PLACEHOLDER`, run tests, smoke.

## Acceptance criteria
- Readouts quoted equal the figures' defaults (Findings).
- Harness green with both ids removed; wave-4, checks, graph and `test:guide-stochastic` pass; no new forward
  citations (the graph test's `PREVIEWS` set is not edited).
- Smoke of both lessons in EN and HU: no problems.

## Verification
```bash
npm run test:guide-wave4 && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/features/guide src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/stochastic/law-of-large-numbers-clt,/hu/guide/stochastic/correlated-brownian-motions,/guide/stochastic" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- `law-of-large-numbers-clt` is read before "Probability spaces …": write "almost surely" in plain words and point
  to that lesson only in the closing note after Summary (previews there are allowed by the graph test).
- The histogram with 20 000 draws is cheap, but keep `m` fixed and seeded so the readouts in the text stay true.
- HU terminology: „nagy számok gyenge/erős törvénye”, „centrális határeloszlás-tétel”, „Cholesky-felbontás”,
  „kvadratikus kovariáció”.

## Findings (fill in during execution)
- Default readouts (CLT figure: exponential source, n = 10, 4,000 averages, seed 1): Kolmogorov distance 0.054, simulated sd of the average 0.312 vs σ/√n 0.316. Other quoted values: exponential n = 100 → 0.018; Bernoulli p = 0.1 → 0.236 (n = 10), 0.089 (n = 100); noise floor 0.8687/√4000 ≈ 0.014; Berry–Esseen bound for exponential n = 10 ≈ 0.36. Correlated figure (ρ = −0.7): L₂₂ = 0.714, ⟨W₁,W₂⟩_T = −0.70; the sample increment correlation (−0.64 at seed 3, 250 steps) is shown but not quoted.
- HU text (for owner review): both lessons in full (`lawOfLargeNumbersClt.ts`, `correlatedBrownianMotions.ts`, hu blocks), plus figure strings `gfW4FieldSource`, `gfW4Source*`, `gfW4FieldN`, `gfW4CltAria`, `gfW4KolmogorovDistance`, `gfW4SdOfAverage`, `gfW4CorrelatedAria`, `gfW4SampleRho`, `gfW4CholeskyL22`, `gfW4Covariation` in `GuideWave4.hu.ts`.
- Deviations: `runningMean` is implemented and tested but not drawn (the figure has one histogram panel to stay under 80 lines). The lessons cite "Monte Carlo option pricing" only in the correlated lesson (later in the track); the LLN/CLT lesson refers to Monte Carlo pricing without quoting a later title. Both lessons end with a preview note after the Summary, as the other lessons do. Word counts EN/HU: 1122/938 and 1020/879.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4), `docs/GUIDES_PLAN.md` §"Writing conventions" and
> `docs/plans/guides-audit/12-new-lessons-stochastic.md`, and confirm plan 07 is marked done in the README (stop and
> report if not). Implement plan 12: write `law-of-large-numbers-clt` and `correlated-brownian-motions` in EN and HU
> with checks and worked examples, build the `clt-convergence` and `correlated-paths` figures on pure, seeded maths
> with tests, and remove both ids from the harness `PLACEHOLDER` list. Edit only your lesson files, figure
> components and the wave-4 math/test/string files. Run the verification commands (including the smoke test) and
> make them pass. Fill in Findings, set plan 12 to `done` in the README table, and summarise.
