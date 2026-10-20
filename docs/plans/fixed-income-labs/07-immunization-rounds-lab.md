# 07 — New lab: immunisation rounds game

Status: done (2026-10-19) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Immunisation (match PV and duration of assets to a liability, then rebalance as time and rates move) is
the place where duration stops being a formula and becomes a decision. A rounds game (LABS_PLAN W6,
accepted for FI) makes the reader *manage* a portfolio: each round a curve shock hits, they rebalance,
and the funding gap is scored.

## Current state (verified 2026-10-19)
- Guide figure math: `src/features/guide/guide.interactive.immunizationShock.math.ts` — `IMMUNIZATION`
  constants, `BondSpec = { coupon; years }` (note: **a different `BondSpec`** from
  `src/lib/finance/bond.ts`), `bondPrice`, `bondDuration`, `liabilityValue`, `matchedShortWeight`,
  `holdings(portfolio)`, `afterShock(portfolio, shock)`, `surplusCurve`. Used by the guide figure
  (test `scripts/guide-interactive-immunization-shock.test.mjs`).
- Shared bond math: `src/lib/finance/bond.ts` (`bondPrice`, `macaulayDuration`, `modifiedDuration`,
  `convexity`, `BondSpec` with face/couponRate/freq/maturity/ytm — read the file for exact fields).
- Primitives: `DraggableBars` (weights), `WaterfallChart` (surplus change decomposition), `Histogram`,
  `usePlayback`, `SeedControl` (`src/components/SeedControl.tsx`), `GuidedExperiments`, `useUrlState`.
- Adding a module (no hand wiring of nav/home/routes): registry entry in `src/modules/registry.ts`
  (copy the `treasury-futures` entry shape: `id, intuition?, path, navKey, category: "fixed-income",
  status: "beta", seo: {titleKey, descKey}, about: moduleAbout("<Name>", 4), relatedGuides,
  Component: lazy(...)`) plus strings. To find every string-table wiring point, grep
  `TreasuryFutures` and `treasury-futures` in `src/` (excluding the feature folder): it's
  `src/Language/TreasuryFutures(.hu).ts`, `src/Language/index.en.ts` / `index.hu.ts`, `ModuleAbout(.hu).ts`
  (`moduleAbout("X", 4)` needs 4 FAQ entries), `Seo(.hu).ts`, nav key in the shell strings, and the
  stylesheet `@use` in `src/styles/main.scss`. `intuition` is optional — skip it.
- Related guide id: `immunization` lesson exists (the duration page links "Immunization and duration
  matching"); find the guide id in `src/features/guide/guide.meta.ts`.

## Goal
A module `immunization` at `/immunization`: "Fund a liability of 1,000,000 due in 7 years."
- Assets: 2–3 bonds (short, long, optionally zero matching the horizon). Reader sets holdings by dragging
  weight bars (`DraggableBars`, sum fixed) or typing.
- Live gauges: PV(assets) vs PV(liability), duration(assets) vs duration(liability), convexity — shown as
  two side-by-side horizontal comparison bars ("seesaw"), green when matched within tolerance.
- **Round loop** (8 rounds = 8 half-years or years): Play/Next applies a random curve shock (parallel or
  twist, seeded), time advances, coupons accrue into cash; surplus is recomputed; a waterfall shows why the
  surplus changed (rate effect via duration mismatch, convexity, carry/time). Reader can rebalance between
  rounds (each rebalance costs a small spread, so "rebalance every round" isn't free).
- End screen: surplus path vs a "never rebalanced" and an "auto-immunised" benchmark (both computed on the
  same seed), score = final surplus / liability in bp; "Replay seed" and "New seed".

## Non-goals
Multi-liability (cash-flow matching), stochastic rate models, persistence of high scores.

## Constraints
Math promoted to `src/lib/finance/immunization.ts` (pure), guide file **re-exports** what it needs from
there (same behaviour; its test must still pass). Feature folder `src/features/immunization/` with
`ImmunizationView.tsx` ≤ 150 lines + components + `immunization.math.ts` (game engine) +
`immunization.types.ts`. Strings `src/Language/Immunization(.hu).ts`, keys prefixed `im`.

## Steps
### Phase A — engine (tests green before Phase B)
1. `src/lib/finance/immunization.ts`: generalise the guide math to arbitrary bonds and a curve:
   ```ts
   export type Holding = { coupon: number; maturity: number; face: number };
   /// PV, Macaulay/modified duration and convexity of a holding set on a flat or shifted curve.
   export function portfolioRisk(h: Holding[], y: number): { pv: number; dMod: number; convexity: number }
   /// Faces of two bonds that match PV and modified duration of a liability (solve 2×2).
   export function immunizingFaces(short: Holding, long: Holding, liabFace: number, liabT: number, y: number): [number, number]
   ```
   Move the guide's `bondPrice`/`bondDuration` logic here; keep guide exports as thin wrappers.
2. `src/features/immunization/immunization.math.ts` game engine (pure, seeded RNG — reuse an existing
   seeded RNG from `src/lib/stats` or `src/lib/math`; grep `mulberry` / `seed` there):
   ```ts
   export type GameState = { round: number; t: number; y: number; cash: number; holdings: Holding[]; history: RoundResult[] };
   export function newGame(seed: number, config?: Partial<GameConfig>): GameState
   export function drawShock(seed: number, round: number): { parallelBp: number; twistBp: number }
   export function advance(state: GameState, shock: Shock): GameState          // time passes, coupons, reprice
   export function rebalance(state: GameState, weights: number[]): GameState   // with cost
   export function surplusAttribution(prev: GameState, next: GameState): { rate: number; convexity: number; carry: number; cost: number }
   export function benchmarks(seed: number, config?): { buyHold: number[]; autoImmunised: number[] }
   ```
   Tests `scripts/immunization-lab.test.mjs` (+ npm `test:immunization-lab`): matched faces give
   |surplus change| < 0.1% of liability for ±50 bp parallel; attribution parts sum to total within 1e-6;
   same seed → same game.
### Phase B — UI
3. Components (≤ 150 lines each): `HoldingsEditor` (DraggableBars + inputs), `MatchGauges`,
   `RoundControls` (Next round / Play all via `usePlayback`, Rebalance, Seed), `SurplusChart` (LineChart
   with benchmarks), `RoundWaterfall` (WaterfallChart), `GameSummary`. Hook `useImmunizationGame.ts`.
4. URL: `seed`, `round` not needed; `seed` only (`useUrlState`).
5. Register module + strings + stylesheet `src/styles/immunization.scss` (use `_breakpoints.scss` mixins
   from plan 02). `relatedGuides`: the immunisation guide id + `"duration-convexity"`.

## Acceptance criteria
- A full game is playable by keyboard only.
- Layout audit green for `/immunization` and `/hu/immunization` at all widths, also mid-game and on the end
  screen (`--after` clicks Next 8 times).
- Guide immunisation test still passes; the guide figure looks unchanged.
- Module appears in sidebar, home and sitemap without hand edits outside the registry/strings.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:immunization-lab && node --test scripts/guide-interactive-immunization-shock.test.mjs && npm run test:seo
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/immunization,/hu/immunization" \
  --after "(async()=>{for(let i=0;i<8;i++){[...document.querySelectorAll('button')].find(b=>b.dataset.action==='next-round')?.click();await new Promise(r=>setTimeout(r,250))}return true})()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/immunization,/hu/immunization,/"
```
(Give the Next button `data-action="next-round"` for testability.)

## Pitfalls
- Two `BondSpec` types exist; don't import the guide one into lib — define `Holding`.
- `test:seo` audits pre-rendered pages: a new module needs its SEO title/description keys or it fails.
- Funding-gap colours: use `--positive`/`--negative` tokens, not hard-coded hex.

## Findings
- Done 2026-10-19 (session 327feecb). Plan 02 was still in progress, so the module uses the existing `_breakpoints.scss` mixins only.
- Engine: `src/lib/finance/immunization.ts` (`pricePerFace`, `macaulay`, `convexityOf`, `portfolioRisk`, `matchWeights`, `immunizingFaces`); the guide math is now a thin wrapper over it (its 4 tests still pass, figure unchanged). `immunization.math.ts` holds the game: 3 new-issue bond tenors (2/5/12y) plus cash, curve = level + tilt (parallel + twist shocks), yearly rounds, coupons/redemptions to cash, rebalance cost 5 bp of the value moved. 9 tests in `scripts/immunization-lab.test.mjs` (`npm run test:immunization-lab`).
- Deviations: the liability is due in **8 years** with 8 yearly rounds (not 7, so the game ends when it falls due); bonds are priced at their own yield on the tilted curve, with annual coupons; "Play on" ticks one round per 1.1 s (all rounds at once under reduced motion). Benchmarks (never rebalanced, free auto-immunise each year) are shown only up to the current round to avoid spoilers; on average auto ends closer to zero than buy-and-hold (tested over 10 seeds), not in every seed, because a twist is not covered by duration matching.
- Attribution: carry (a year at the old curve), rate (first order, per position), convexity (remainder), trading cost; parts sum to the change in surplus (tested, incl. after a costly rebalance).
- URL: `seed` only. Keyboard: the bars (arrow keys) and all buttons work; `data-action="next-round"` on the Next button.
- Audit (`layout-audit`, 6 widths, light and dark, EN/HU, plus 360/1280 after 8 rounds): clean except `/hu/immunization` at 768 px, where the global top nav's HU button is offscreen (not this module; plans 02/03). Y-axis labels use compact formats (`10k`, bars without %) to avoid the clipping the shared charts show on phones.
- Reused unchanged: `DraggableBars` (shares rescale to sum 1 in `setWeight`), `WaterfallChart`, `LineChart`, `SeedControl`, `useTicker`.
- HU drafts for review: all of `Immunization.hu.ts` and the `aboutImmunization*` entries in `ModuleAbout.hu.ts`, `seo*Immunization` in `Seo.hu.ts`.
- Not done: `GuidedExperiments`, and linking the guide's `labs` list to the new module (guide.meta types).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/07-immunization-rounds-lab.md`; confirm plans 01 and 02 are
> done and that no other plan is currently editing registry.ts (stop if not). Implement plan 07 in two
> phases: the promoted immunisation math and seeded game engine with tests, then the new `immunization`
> module UI, registered through the registry. Run the verification commands, fill in Findings (HU drafts),
> set plan 07 to done in the README table, and summarise.
