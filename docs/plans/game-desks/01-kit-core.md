# 01 — Game kit core (pure) + Cholesky + challenge store

Status: done (2026-10-24) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
Four new desks and the Sandbox need the same non-visual building blocks the Hedging Desk already has in
private form: objective statuses, saved mission progress, demo state folding, advice ranking, seeded
helpers, and a place to save lab challenge scores. Writing them once, pure and tested, lets every desk
engine start in parallel.

## Current state (verified 2026-10-23, commit `73f67d7`)
- No `src/lib/game/` folder exists. `src/lib/index.ts` re-exports `./math`, `./stats`, `./finance` only.
- Hedging-desk equivalents (read them, do **not** edit them; plan 03 migrates the desk):
  - `src/features/hedging-desk/engine/objectives.math.ts` L8–12 private `capStatus(value, limit, warnFrom, settled)`:
    fail if `value > limit`; pass once settled; else `atRisk` when `value >= warnFrom`, else `onTrack`.
    The "within ± limit at settle" pattern is at L21–25.
  - `src/features/hedging-desk/engine/desk.types.ts` L111 `ObjectiveStatus = "onTrack" | "atRisk" | "pass" | "fail"`.
  - `src/features/hedging-desk/deskProgress.ts` (61 lines): key `qs.hedgingDesk.progress.v1`, module cache,
    `listeners` set, `readProgress` (try/catch, `{}` on bad JSON), `writeProgress`, `mergeResult`
    (best = smallest |P&L| among passes), `subscribeProgress` (also window `storage` events).
  - `src/features/hedging-desk/demo/demo.math.ts`: `demoStates(steps, start, market, mission)` folds each
    step's actions through the reducer; `stepIndexById`.
  - `src/features/hedging-desk/help/advice.math.ts` L11–12 and L155–159: `TONE_ORDER {urgent:0,suggest:1,info:2,done:3}`,
    stable sort, slice to `MAX_ITEMS = 6`.
- Cholesky: only in `src/features/guide/guide.wave4.math.ts` ~L120 `cholesky(corr): number[][] | null`
  (returns `null` when not positive definite). `src/lib/math/matrix.ts` has `Matrix`, `Vector`, `dot`,
  `identity`, `transpose`, `matMul`, `matVec`, `inverse`, `quadraticForm`, `symmetricEig`; no Cholesky.
- Lab challenge sites (for the ids below): PredictReveal users in `brownian-motion/components/BarrierPredict.tsx`,
  `capm/components/BetaTab.tsx`, `gbm/GbmCentres.tsx`, `npv-irr/components/OverviewTab.tsx`,
  `stochastic-models/{CltPrediction,CovarianceExplore,FirstPassageExplore,HittingExplore,RunningMaxExplore,SqrtPrediction}.tsx`,
  `tvm/TvmDoubling.tsx`, `wacc/WaccView.tsx`; RangeGuess users `portfolio-lab/components/VolCalibration.tsx`,
  `risk-return/components/ReturnCalibration.tsx`, `stochastic-models/FirstPassageRange.tsx`; custom
  `yield-curve/components/ShockPredict.tsx`.
- Test loader: `scripts/lib/load-ts.mjs` exports `importSrc(pathUnderSrc)`; relative imports only, `.ts` appended.

## Goal
1. `src/lib/game/` with the exact API below, pure (no React, no DOM except guarded `localStorage`).
2. `cholesky` in `src/lib/math/matrix.ts`; the guide file imports it instead of keeping its own copy.
3. `scripts/game-kit.test.mjs` and `"test:game-kit"` in `package.json`, green.

## Non-goals
- No React hooks or components (plan 02). No hedging-desk edits (plan 03). No lab call-site wiring (plan 17).

## Constraints
- Do not re-export `src/lib/game` from `src/lib/index.ts` (the test loader cannot follow folder indexes,
  and the kit is imported by path).
- `///` docs on every export. Plain `.ts`, may exceed 150 lines but keep files cohesive.

## Steps
1. **`src/lib/game/game.types.ts`** (types only):
   ```ts
   export type ObjectiveStatus = "onTrack" | "atRisk" | "pass" | "fail";
   /// One evaluated objective. `D` is the desk's objective definition union.
   export type ObjectiveResult<D> = { def: D; status: ObjectiveStatus; value: number };
   /// Minimal mission shape every desk mission extends. Empty `objectives` = free play (future sandbox mode).
   export type MissionBase<D> = { id: string; objectives: D[] };
   /// Event envelope: `t` is the clock tick (day, month or year) the event belongs to.
   export type GameEventBase = { t: number; kind: string };
   export type ClockUnit = "day" | "month" | "year";
   export type AdviceTone = "urgent" | "suggest" | "info" | "done";
   /// Advice item; `A` is the desk's action union, `vars` feed the copy.
   export type AdviceItem<A> = { id: string; tone: AdviceTone; vars: Record<string, number>; action?: A };
   /// One scripted demo step; `S` = screen ids, `X` = desk action.
   export type DemoStepBase<S extends string, X> = { id: string; screen: S; anchor: string; actions: X[]; holdMs: number };
   export type MissionProgress = { completed: boolean; best: number | null };
   export type ProgressMap = Readonly<Record<string, MissionProgress>>;
   export type ChallengeKind = "guess" | "range" | "pick" | "draw" | "place";
   export type ChallengeStats = { played: number; hits: number; streak: number; bestStreak: number; lastAt: number };
   ```
2. **`src/lib/game/objectives.ts`**:
   - `capStatus(value, limit, warnFrom, settled): ObjectiveStatus` (same rule as the hedging desk).
   - `floorStatus(value, floor, warnBelow, settled)`: fail if `value < floor` **once settled**, `atRisk` when
     live and `value < warnBelow`, `pass` when settled, else `onTrack`. (Use for "surplus ≥ 0 at the end".)
   - `bandAtSettle(value, lo, hi, settled)`: settled → pass if `lo ≤ value ≤ hi` else fail; live → onTrack
     inside, atRisk outside.
   - `countStatus(misses, allowed, settled)`: `capStatus(misses, allowed, allowed, settled)`.
   - `allPassed(results): boolean` (every status `pass`; empty list → `false`).
3. **`src/lib/game/progress.ts`** (store factory; storage access guarded, server-safe):
   ```ts
   export const progressKey = (deskId: string) => `qs.game.${deskId}.progress.v1`;
   export type Better = (candidate: number, current: number) => boolean;
   export const higherIsBetter: Better; export const closerToZero: Better;
   export function mergeProgress(p: ProgressMap, missionId: string, passed: boolean, score: number, better: Better): ProgressMap;
   export type ProgressStore = { key: string; read(): ProgressMap; write(p: ProgressMap): void;
     record(missionId: string, passed: boolean, score: number): void; subscribe(listener: () => void): () => void };
   export function createProgressStore(deskId: string, better: Better): ProgressStore;
   export const EMPTY_PROGRESS: ProgressMap;
   export function readProgressKey(key: string): ProgressMap; // for the Sandbox; no cache
   ```
   `mergeProgress`: a failed run sets nothing new (keeps `completed`); a pass sets `completed: true` and
   replaces `best` when `best === null || better(score, best)`. `read()` caches per store; `subscribe` also
   listens to `storage` events for its key (guard `typeof window`). All storage calls in try/catch.
4. **`src/lib/game/challengeScores.ts`**: key `qs.game.challenges.v1`, `Record<challengeId, ChallengeStats>`.
   `recordChallenge(id, hit: boolean, now: number)` (played+1, hits+hit, streak = hit ? streak+1 : 0,
   bestStreak = max), `readChallenges(): Readonly<Record<string, ChallengeStats>>`, `subscribeChallenges`,
   pure `mergeChallenge(stats | undefined, hit, now): ChallengeStats` (unit-tested). `now` is passed in (no
   `Date.now` inside).
5. **`src/lib/game/challenges.data.ts`**: `export const CHALLENGES` — one entry per lab round, ids stable
   and kebab-case, with `{ id, area: "stochastic"|"portfolio"|"rates"|"corporate", moduleId, kind: ChallengeKind, tolerance: string }`:
   `clt-spread`, `sqrt-scaling`, `covariance`, `running-max`, `first-passage`, `first-passage-range`,
   `hitting`, `barrier-hit`, `gbm-median`, `yield-shock-pick`, `return-range`, `vol-range`, `capm-beta-draw`,
   `irr-guess`, `doubling-time`, `wacc-min`. (`moduleId` = the registry id, e.g. `"stochastic-models"`,
   `"brownian-motion"`, `"gbm"`, `"yield-curve"`, `"risk-return"`, `"portfolio-lab"`, `"capm"`,
   `"npv-irr"`, `"tvm"`, `"wacc"`.) Tolerances are display strings ("±5 pp", "90%", "1 of 4"); read each
   site's actual tolerance from its file and record it.
6. **`src/lib/game/demo.ts`**: `foldStates<S, X>(start: S, steps: { actions: X[] }[], reduce: (s: S, x: X) => S): S[]`
   (state **after** each step, length = steps.length) and `stepIndexById(steps, id): number` (−1 if absent).
7. **`src/lib/game/advice.ts`**: `TONE_ORDER`, `rankAdvice<T extends { tone: AdviceTone }>(items: T[], max = 6): T[]`
   (stable by tone, then input order, sliced).
8. **`src/lib/game/seed.ts`**: `MAX_SEED = 9999`, `nextSeed(seed) = seed >= MAX_SEED ? 1 : seed + 1`,
   `subSeed(seed, salt) = (Math.imul(seed, 7919) + salt * 104729) >>> 0` (for event and Monte Carlo RNGs that
   must not disturb the main path).
9. **Cholesky**: add `cholesky(a: Matrix): Matrix | null` to `src/lib/math/matrix.ts` (lower-triangular L
   with `L Lᵀ = a`; `null` if a pivot ≤ 1e-12). Copy the algorithm from `guide.wave4.math.ts`; then in that
   guide file replace the local function with `import { cholesky } from "../../lib/math/matrix";` plus
   `export { cholesky };` if it was exported. Run `npm run test:guide-wave4` to prove nothing changed.
10. **Tests** `scripts/game-kit.test.mjs` (via `importSrc`): status helpers truth tables; `mergeProgress`
    with both `Better`s; a fake `localStorage` (assign `globalThis.localStorage`) round-trip for
    `createProgressStore` and `challengeScores`; `foldStates` length and order; `rankAdvice` stability;
    `nextSeed` wrap; `cholesky` reproduces a 3×3 PD matrix within 1e-12 and returns `null` for a non-PD one;
    `CHALLENGES` ids unique and kebab-case. Add `"test:game-kit": "node --test scripts/game-kit.test.mjs",`
    after the `test:hedging-desk` line in `package.json`.

## Acceptance criteria
- `npm run test:game-kit` passes; breaking `capStatus` (swap `>` for `>=`) fails a test.
- `npm run test:guide-wave4` and `npm run test:hedging-desk` still pass.
- `grep -rn "react\|document\." src/lib/game` finds nothing.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:game-kit && npm run test:guide-wave4 && npm run test:hedging-desk
grep -rn "from \"react\"\|document\." src/lib/game && echo LEAK || echo pure
```

## Pitfalls
- **Server rendering:** every function that touches `localStorage` or `window` must check `typeof window`
  and catch errors; pre-render runs these modules in Node.
- **Cache per store, not global:** two desks must not share a cache object.
- **Do not change the hedging desk's key or shape here.** Its migration (with old-key read) is plan 03.
- The guide file may have uncommitted edits from another session: re-read before editing and keep them.

## Findings (fill in during execution)
- Challenge tolerances read from each site: clt-spread ±0.05, sqrt-scaling ±0.1, covariance ±0.03, running-max ±0.05, first-passage ±0.03 (shown ±3 pp), hitting ±0.03 (±3 pp), barrier-hit ±5 (pp), gbm-median ±0.03·S0, capm-beta-draw ±0.15 (`BETA_TOLERANCE`), irr-guess ±0.005 (±0.5 pp), doubling-time ±0.5 y, wacc-min ±0.05 D/V (in `useWaccLab.ts`), range rounds nominal 90%, yield-shock-pick 1 of 4 scenarios.
- Deviations and why: added an internal helper `src/lib/game/storage.ts` (`readJsonObject`, `writeJsonObject`, `onStorageKey`) so progress and challenge stores share guarded storage code (DRY); exported `CHALLENGES_KEY` and type `ChallengeDef`/`ChallengeArea`. `mergeProgress` returns the same object when nothing changes, so `record` only notifies on real change. `npm run lint` is red on pre-existing files (AppShell, diffusion, heston `set-state-in-effect`); every file in this plan lints clean.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections 2
> and 4), `docs/plans/game-desks/LOG.md` and `docs/plans/game-desks/01-kit-core.md`. Check the README says
> READY. Implement plan 01: the pure `src/lib/game/` modules with the exact API given, `cholesky` in
> `src/lib/math/matrix.ts` (guide file importing it), `scripts/game-kit.test.mjs` and the `test:game-kit`
> script. Run the verification block. Fill in Findings, append a DONE line to LOG.md, set plan 01 to `done`
> in the README table, and summarise. Do not stash or check out; other sessions share the tree.
