# 17 — Save and score lab challenges

Status: done (2026-10-24) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Lab challenge rounds (predict-then-reveal, range guesses, the yield-shock pick) keep their history only in
component state, so nothing survives a reload and the Sandbox has nothing to show. This plan records every
revealed round in the kit's challenge store and shows a one-line record under each challenge.

## Current state (verified 2026-10-24, commit `349c0ca`)
- `src/components/ui/usePredictReveal.ts` (54 lines): options `{ truth, tolerance, resetKey }`; `reveal()`
  computes `hit = |guess − truth| ≤ tolerance` and appends to session `history`.
- `src/components/ui/useRangeGuess.ts` (86 lines): options `{ truth, nominal, initial, bounds, resetKey }`;
  `reveal()` scores the round with `scoreRound(lo, hi, value, nominal)` (`rangeGuess.logic.ts`); `hit` on the
  last round.
- Renderers `src/components/ui/PredictReveal.tsx`, `RangeGuess.tsx`; both exported from `src/components/ui/index.ts`.
- Call sites (challenge ids from plan 01's `CHALLENGES` in `src/lib/game/challenges.data.ts`):
  PredictReveal — `stochastic-models/CltPrediction.tsx` (`clt-spread`), `SqrtPrediction.tsx` (`sqrt-scaling`),
  `CovarianceExplore.tsx` (`covariance`), `RunningMaxExplore.tsx` (`running-max`), `FirstPassageExplore.tsx`
  (`first-passage`), `HittingExplore.tsx` (`hitting`), `brownian-motion/components/BarrierPredict.tsx`
  (`barrier-hit`), `gbm/GbmCentres.tsx` (`gbm-median`), `capm/components/BetaTab.tsx` (`capm-beta-draw`),
  `npv-irr/components/OverviewTab.tsx` (`irr-guess`), `tvm/TvmDoubling.tsx` (`doubling-time`),
  `wacc/WaccView.tsx` (`wacc-min`); RangeGuess — `stochastic-models/FirstPassageRange.tsx`
  (`first-passage-range`), `risk-return/components/ReturnCalibration.tsx` (`return-range`),
  `portfolio-lab/components/VolCalibration.tsx` (`vol-range`); custom — `yield-curve/components/ShockPredict.tsx`
  (`yield-shock-pick`). All paths under `src/features/`. Confirm each id against `CHALLENGES` before editing.
- Kit (plan 01): `recordChallenge(id, hit, now)`, `readChallenges()`, `subscribeChallenges(listener)`,
  `ChallengeStats { played, hits, streak, bestStreak, lastAt }`.

## Goal
1. Both hooks take an optional `challengeId`; each reveal records one round.
2. Every call site passes its id; `ShockPredict` records its pick.
3. A small `ChallengeRecord` line ("Played 7 · 5 hits · streak 3 · best 4") under each challenge.

## Non-goals
- No Sandbox page (plan 16). No changes to challenge rules, tolerances or layouts beyond the record line.
- No edits to derivatives labs (none are call sites).

## Constraints
- Call-site edits are one prop / one option each; several call sites belong to modules other packs are
  editing (`docs/plans/fixed-income-labs` for yield-curve): re-read the file right before editing and keep
  everything else.
- Copy in `src/Language/Challenges.ts` (+ `.hu.ts`, prefix `chl`), registered at the end of the index files.

## Steps
1. `usePredictReveal`: add `challengeId?: string` to `Options`; inside `reveal()` after computing `e`, call
   `if (challengeId) recordChallenge(challengeId, Math.abs(e) <= tolerance, Date.now())`. `Date.now` in an
   event handler is fine (not render). Same in `useRangeGuess.reveal()` with the scored round's `hit`.
2. `src/components/ui/useChallengeStats.ts`: `useChallengeStats(id?: string): ChallengeStats | null` via
   `useSyncExternalStore(subscribeChallenges, readChallenges, () => EMPTY)` (stable empty object), then
   pick `id`.
3. `src/components/ui/ChallengeRecord.tsx` (`{ id }`): renders nothing for no plays; else one muted line with
   `chlPlayed`, `chlHits`, `chlStreak`, `chlBest` (plurals via i18next count). Plain text, no pill or badge.
4. `PredictReveal.tsx` and `RangeGuess.tsx`: optional `challengeId` prop; when set, render
   `<ChallengeRecord id={challengeId} />` under the existing result block. Keep each file ≤ ~150 lines.
5. Call sites: pass `challengeId` to the hook options **and** the renderer prop (one constant per file,
   `const CHALLENGE = "clt-spread";`). `ShockPredict.tsx`: call `recordChallenge("yield-shock-pick", hit, Date.now())`
   where it reveals its answer, and render `ChallengeRecord`.
6. Tests `scripts/challenge-scores.test.mjs`: with a fake `localStorage`, `recordChallenge` sequences give the
   expected `streak`/`bestStreak`; every id passed at a call site (grep the source for `challengeId` /
   `CHALLENGE =` / `recordChallenge(`) exists in `CHALLENGES`, and every `CHALLENGES` id is used exactly once;
   `Challenges` copy EN/HU parity, HU ≠ EN. `package.json`: `"test:challenges": "node --test scripts/challenge-scores.test.mjs",`.

## Acceptance criteria
- Revealing a round on any of the 16 sites increments its record, which survives a reload and updates in a
  second tab.
- `npm run test:labs`, `test:portfolio-labs`, `test:clt` and `test:yield-curve` still pass.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:challenges && npm run test:game-kit && npm run test:labs && npm run test:portfolio-labs && npm run test:clt && npm run test:yield-curve
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/stochastic-models,/brownian-motion,/gbm,/capm,/npv-irr,/tvm,/wacc,/risk-return,/portfolio-lab,/yield-curve"
```
Stop the server; confirm the port is free.

## Pitfalls
- **Double recording:** React strict mode double-invokes state updaters; record in the event handler, never
  inside a `setHistory` updater.
- **Pre-render:** `ChallengeRecord` must render the server snapshot (nothing) first; no `localStorage` in render.
- **Ids drift:** if a site's challenge differs from plan 01's id list, fix the data in `challenges.data.ts`
  (append a CONTRACT line to LOG.md) rather than inventing a second id.

## Findings (fill in during execution)
- Sites changed and ids (one `challengeId: "<id>"` option each): CltPrediction `clt-spread`, SqrtPrediction
  `sqrt-scaling`, CovarianceExplore `covariance`, RunningMaxExplore `running-max`, FirstPassageExplore
  `first-passage`, HittingExplore `hitting`, FirstPassageRange `first-passage-range`, BarrierPredict
  `barrier-hit`, GbmCentres `gbm-median`, BetaTab `capm-beta-draw`, OverviewTab `irr-guess`, TvmDoubling
  `doubling-time`, `wacc/useWaccLab.ts` `wacc-min` (the hook lives there, not in WaccView), ReturnCalibration
  `return-range`, VolCalibration `vol-range`, ShockPredict `yield-shock-pick` (`const CHALLENGE`). All 16 ids
  match `CHALLENGES`; no data change.
- Deviations: `challengeId` is carried **on the hook state** (`PredictRevealState.challengeId`,
  `RangeGuessState.challengeId`) and the renderers show `ChallengeRecord` from `state.challengeId`, instead of
  a second renderer prop. Four stochastic sites render through child components, so this keeps every call
  site to one edit. `ShockPredict` records via a new optional `PredictExplain` prop `onFirstPick(correct)`:
  only the first pick of a round counts. No plurals: the record line is label + number
  ("Saved record: played 7 · hits 5 · streak 3 · best streak 4"). Style `.lp-challenge-record` in
  `_lab-primitives.scss`.
- Smoke: the 10 lab paths clean; `/npv-irr` once showed React #418 (hydration), clean on 3 reruns (flaky,
  untouched by the record line, which renders nothing before a play).
- Items awaiting owner approval: HU strings added: `chlRecord` "Mentett eredmény", `chlPlayed` "játszott kör",
  `chlHits` "találat", `chlStreak` "sorozat", `chlBest` "legjobb sorozat".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/17-challenge-scores.md`; confirm plan 01 is done. Implement
> plan 17: optional `challengeId` recording in `usePredictReveal` / `useRangeGuess`, `useChallengeStats`,
> `ChallengeRecord`, the 16 call sites, copy and `test:challenges`. Run the verification block, fill in
> Findings, append DONE to LOG.md, set plan 17 to `done`, and summarise. Re-read shared lab files before
> editing; do not stash or check out.
