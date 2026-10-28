# 07 — Monte Carlo lab: new sub-pages

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
Studio chapter 7 only linked to this lab; variance reduction and Feynman–Kac have no hands-on page.

## Current state (verified 2026-10-28)
- `src/features/monte-carlo/MonteCarloView.tsx` (117), convergence/distribution/exotic components,
  `monteCarlo.worker.ts` (heavy compute already off-thread), `monteCarlo.estimators.ts`.
- Registry `id: "monte-carlo"`, no `subNav`. Strings `src/Language/MonteCarlo(.hu).ts`.

## Goal
Sub-pages under `/monte-carlo/`:
1. `variance-reduction` – European call: plain vs antithetic vs control variate (underlying as control) vs
   both; running estimate with CI ribbons per method; variance-reduction factor table and "paths saved".
2. `feynman-kac` – heat-equation/Black–Scholes: price u(t,x) from the PDE (closed form) vs MC average of
   terminal payoffs started at x; drag x and t; histogram of discounted payoffs.

## Constraints
README §4. Reuse `monteCarlo.estimators.ts` and the worker; math pure. Test `scripts/mc-pages.test.mjs`.
Registry: only the `monte-carlo` entry.

## Steps
1. Estimators + tests (antithetic variance < plain; control-variate estimate within 3 SE of BS price).
2. `MonteCarloPages.tsx`, two pages; strings EN+HU; registry subNav.

## Acceptance criteria
Tests pass; audit clean on `/monte-carlo` + two sub-pages (+`/hu`) at 360/768/1280 light+dark.

## Verification
`node --test scripts/mc-pages.test.mjs && npx tsc -b`; README §4 audit.

## Pitfalls
Keep simulations in the worker; the main thread freezes above ~50k paths.

## Findings (fill in during execution)
- Added `monteCarloPages.math.ts` (`varianceReductionRun`: plain/antithetic/control/both, `feynmanKacRun`), reusing `controlVariate`
  from the lab; types appended to `monteCarlo.types.ts`; `McVrMethod` adds "both" and `McConvergenceChart` is now generic over it.
- One generic worker (`monteCarloPages.worker.ts`) + `useMcJob` hook (sync first result, debounced worker updates).
- Components: `MonteCarloPages.tsx` (wrapper, lazy sub-pages), `McVarianceReductionView`, `McVrTable`, `McFeynmanKacView`,
  `McFkCurve`, shared `McTermsSliders`. Strings appended to `MonteCarlo(.hu).ts` (nav, SEO descriptions, page copy); registry `subNav` on `monte-carlo` only.
- Feynman-Kac curve uses common random numbers across x, so the MC line is smooth. "Draws saved" = plain draws for equal SE minus draws used.
- Tests `scripts/mc-pages.test.mjs` (6) + `lab-monte-carlo.test.mjs` pass; `tsc -b` clean for monte-carlo files (other sessions have unrelated errors).
- Audit on private build, port 4195: 36/36 clean (3 pages x EN/HU x 360/768/1280 x light/dark). A histogram marker-label collision on Feynman-Kac was fixed by labelling one marker only. VR table scrolls horizontally in narrow panels (DataTable behaviour).

## Prompt to hand off
> Read `CLAUDE.md`, the README §4 and `07-monte-carlo-pages.md`. Add the two Monte Carlo sub-pages. Verify,
> fill Findings, mark 07 done, summarise.
