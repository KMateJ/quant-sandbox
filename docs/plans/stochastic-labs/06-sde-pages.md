# 06 — GBM lab: SDE sub-pages

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: L

## Why
Studio chapter 5 (SDEs: Euler–Maruyama, correlated BMs, mean reversion, jumps) was empty and linked to the
GBM lab, which has one page.

## Current state (verified 2026-10-28)
- `src/features/gbm/GbmView.tsx` (129), `GbmCentres.tsx`, `GbmCentresChart.tsx`, `gbm.math.ts`, `gbm.url.ts`.
- Registry entry `id: "gbm"`, no `subNav`. Strings `src/Language/Gbm(.hu).ts`.
- Guide math to promote: `src/features/guide/guide.interactive.eulerConvergence.math.ts`.
- Sub-page pattern: `YieldCurvePages.tsx` + registry `subNav`.

## Goal
Sub-pages under `/gbm/`:
1. `euler-maruyama` – same Brownian increments drive exact GBM and Euler scheme; step count slider; strong
   error vs Δt on log-log with slope ½ reference, weak error slope 1.
2. `mean-reversion` – OU/Vasicek: κ, θ, σ; path cloud converging to stationary band θ ± σ/√(2κ); half-life
   marker; "negative rates" share readout.
3. `jumps` – Merton jump-diffusion: λ, jump mean/sd; paths with jump markers; log-return histogram vs normal
   (fat tails, kurtosis readout).
4. `correlated` – two BMs with ρ via Cholesky; scatter of increments + paired paths; empirical ρ readout.

## Constraints
README §4. Math in `features/gbm/*.math.ts`; test `scripts/sde-pages.test.mjs`. `.tsx` ≤ ~150 lines.
Registry: only the `gbm` entry.

## Steps
1. Math + tests (Euler strong error ratio ≈ √2 when Δt halves ±tolerance; OU stationary var; Merton
   mean of log-return; empirical ρ).
2. `GbmPages.tsx`, four pages, controls; strings EN+HU.
3. Registry subNav.

## Acceptance criteria
Tests pass; audit clean on `/gbm` + four sub-pages (+`/hu`) at 360/768/1280 light+dark.

## Verification
`node --test scripts/sde-pages.test.mjs && npx tsc -b`; README §4 audit.

## Pitfalls
Use the same seed for exact and Euler paths, otherwise the error plot is noise.

## Findings (fill in during execution)
- Done 2026-10-28. Math: `gbm.euler.math.ts` (reuses guide eulerConvergence primitives, weak error of the mean is exact), `gbm.ou.math.ts`, `gbm.jumps.math.ts`, `gbm.corr.math.ts`; `excessKurtosis` appended to `lib/stats/moments.ts`, `normalLaw` to `distributions.ts`. Test `scripts/sde-pages.test.mjs` (7 tests) passes; `lab-gbm` and `lab-simulation` still pass.
- UI: `GbmPages.tsx` (lazy sub-pages in `features/gbm/sde/`, shared `SdeLayout`), URL schemas in `gbm.sde.url.ts`, strings `Language/SdePages(.hu).ts`, styles `_sde-pages.scss`, registry `subNav` on `gbm` only.
- Measured slopes at defaults: strong 0.48, weak 1.00.
- Audit (private build, 360/768/1280, light+dark, EN+HU, 9 paths): all four new pages and their /hu variants clean. Remaining failures are on `/gbm` itself and pre-date this plan: `svg-text-clipped` "0.005" at 1280 and 360 (centres chart axis) plus slider/brand tap-target warnings at 360.
- Gotchas: stat-card titles are uppercased, so Greek letters turn into capitals (sigma becomes the sum sign); keep Greek out of those labels. On Windows the README `mktemp` outDir makes the SEO plugin throw at `closeBundle` (absolute path joined to cwd); the bundle and `index.html` are still written, so the audit works.
- `npx tsc -b` shows errors only in other sessions' files (monte-carlo, guide figures/meta); none in gbm.

## Prompt to hand off
> Read `CLAUDE.md`, the README §4 and `06-sde-pages.md`. Add the four GBM/SDE sub-pages. Verify, fill
> Findings, mark 06 done, summarise.
