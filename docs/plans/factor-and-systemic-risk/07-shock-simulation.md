# 07 — Shock simulation page: rescue game, fragility sweep

Status: done (2026-10-28, session ea82) · Depends on: 04, 05 · Suggested model: Sonnet · Est. size: L

## Why
This is where contagion becomes visible: the reader fails an institution or crashes an asset class, switches
contagion channels on and off, and plays the next 60 days on the network — losses flowing along edges,
institutions turning stressed, critical, failed. Then two games: **rescue** (spend a capital budget better
than the regulator's rules of thumb) and **robust yet fragile** (guess the connectivity at which a system is
most prone to cascades, then reveal the sweep).

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 04: stub `src/features/systemic-risk/pages/ShocksPage.tsx` (yours), shared URL keys in
  `systemicRisk.url.ts` (`net`, `seed`, `edits`), copy table `src/Language/SystemicRiskShocks.ts`/`.hu.ts`
  (prefix `syrShock`), partial `src/styles/_systemic-risk-shocks.scss`, chart `NetworkGraph`
  (`src/components/charts/network/`; edges have `active?` for a one-shot pulse; nodes `status?`, `badge?`).
- After plan 05: `engine/simulate.math.ts` (`simulate(net, shocks, params, interventions)` → `SimResult` with
  `days: DayState[]` (`equity`, `status`, `prices`, `losses`, `lossesById`, `flows`, `events`)), `presets.math.ts`
  (`presetNetwork`, `DEFAULT_PARAMS`), `edits.math.ts` (`applyEdits`, `decodeEdits`), `metrics.math.ts`,
  `policies.math.ts` (`rescuePlan`, `compareRescues`), `fragility.math.ts` (`fragilitySweep`, `sweepChunk`).
  Read plan 05's Findings.
- Plan 06 links here with `?fail=<id>` (plus `net`, `seed`, `edits`).
- Primitives: `usePlayback` + `PlaybackControls` (`showStepButtons`, `showSpeed`), `LineChart`,
  `usePinnedSeries` (pin a run for comparison; see `src/components/charts/usePinnedSeries.ts`), `DraggableBars`,
  `SwitchRow`, `SegmentedControl`, `PredictReveal`/`usePredictReveal` (`input="plot"`), `PredictExplain`,
  `ChallengeRecord`, `StatCard`. Worker pattern: `src/features/monte-carlo/useMonteCarloLab.ts`.

## Goal
1. Shock setup by direct manipulation: click a node to fail it; drag asset-class bars down to crash prices;
   choose instant/gradual; channel switches.
2. Day-by-day playback on the network with an event timeline, flows pulsing along edges, and charts (defaults,
   losses by channel, prices) with pinned comparison runs.
3. Rescue game `syr-rescue` (score) and the fragility sweep with `syr-fragile` (place).

## Non-goals
- Network editing (plan 06; this page only reads `edits`). Historical episodes (plan 08). No engine edits.

## Steps
1. **Hook** `useShocksPage.ts` + `shocks.url.ts` (own keys: `fail`, `asset`, `drop`, `shape`, `ch` (channel
   bitmask), `day`, `mode` = simulate | rescue | fragile): network from shared keys; `shocks` from `fail` and the
   asset bars; `simulate` memoised on (network, shocks, channels); `usePlayback({ steps: params.days })` cursor.
2. **Setup panel** (`components/shocks/ShockSetup.tsx`, `AssetShockBars.tsx`, `ChannelSwitches.tsx`): "Click an
   institution to fail it" (selection on the graph toggles the default shock; a "failed at day 0" badge);
   `DraggableBars` for gov/corp/mbs/equity price shocks (0 … −50%, step 1%); shape `SegmentedControl`; four
   `SwitchRow`s with one-line explanations (counterparty losses, fire sales, funding runs, CCP).
3. **Network playback** (`ContagionGraph.tsx`): `NetworkGraph` with status per node from `days[cursor]`, edges
   `active` when `flows` of that day touch them; node `badge` shows equity lost so far (e.g. "−42%"). Playback bar
   (`PlaybackControls showStepButtons showSpeed`); under reduced motion step manually.
4. **Timeline** (`EventTimeline.tsx`): horizontal track of days with markers generated from `events` (first
   default, fire sales start, runs, peak, calm), labelled in words; click a marker to jump the cursor.
5. **Charts** (`DefaultsChart.tsx`, `ChannelLossChart.tsx`, `PriceChart.tsx`, `ChannelShare.tsx`): defaults (%
   of institutions) over days with "Pin this run" (`usePinnedSeries`) so the reader can compare "fire sales off"
   etc.; losses by channel over time (stacked area or stacked bars per day, four colours with names); asset prices;
   final channel shares as square bars with percentages. Final stats row: total loss, institutions failed,
   peak price drop, days to calm.
6. **Surprises** (`PredictExplain`): "Turn fire sales on. Can an institution with no exposure to the failed one
   still fail?" (*yes — it holds the same assets*); "Funding runs off: fewer failures, but which ones are saved?"
   (*the solvent-but-illiquid ones*).
7. **Rescue game** (`RescuePanel.tsx`, mode `rescue`): fixed seeded scenario (fail the most systemic dealer +
   −20% MBS); budget 4 chunks of $10bn; the reader clicks institutions to add a chunk (badge "+10"; click again
   with Shift or press − to remove; a remaining-budget meter); Run; a results table — none / largest / weakest /
   DebtRank / **you** — defaults and total loss via `compareRescues`; hit = your defaults ≤ the DebtRank
   policy's (ties count); `const CHALLENGE = "syr-rescue"`, `recordChallenge(CHALLENGE, hit, Date.now())`,
   `ChallengeRecord`. Calibrate so that DebtRank beats "largest" on most seeds; record in Findings.
8. **Fragility sweep** (`FragilityPanel.tsx`, `fragility.worker.ts`, `useFragilitySweep.ts`, mode `fragile`): before
   the curve appears, the reader drags a marker on the degree axis to where they think cascades are most likely
   (`usePredictReveal({ truth: argmax degree, tolerance: 1.5, challengeId: "syr-fragile" })`, `PredictReveal
   input="plot"`); then the worker computes `fragilitySweep` degree by degree (`sweepChunk`), drawing the
   probability curve and mean extent as results arrive; clicking a degree shows one sample random network at that
   degree in a small `NetworkGraph`. Copy explains "robust yet fragile": few links ⇒ shocks can't travel; many
   links ⇒ losses are spread thin; in between ⇒ cascades.
9. **View** (`pages/ShocksPage.tsx`, compose only): `PageHeader` with mode `SegmentedControl` (Simulate · Rescue ·
   Robust yet fragile) and Reset; `Workspace columns="thirds"`: setup | graph + playback + timeline (dominant) |
   final stats + channel shares; charts below in a `split`.
10. **Wiring**: append `syr-rescue` (score, "≤ DebtRank policy defaults") and `syr-fragile` (place, "±1.5
    links"); `sbxCh_syr-rescue` "Rescue with a budget" / HU "Mentés korlátos keretből", `sbxCh_syr-fragile`
    "Robust yet fragile" / HU "Robusztus, mégis sérülékeny". If plans 06 and 08 are both `done`, set the registry
    `status` to `"beta"`.
11. **Tests** `scripts/systemic-shocks-page.test.mjs`: URL → shocks mapping (bitmask, `fail`, bars); event
    markers derived from `events`; rescue budget accounting (never above 4 chunks); worker message shapes
    (pure functions imported by the worker).

## Acceptance criteria
- Failing a node and playing shows statuses, pulses and charts in sync; channel switches change the result;
  pinned runs overlay.
- Rescue and fragility rounds record challenges; the worker does not start until the fragility mode is opened
  (smoke `--watch-request "fragility"` false on the default URL).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:systemic-risk && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/systemic-risk/shocks,/systemic-risk/shocks?mode=rescue,/systemic-risk/shocks?drop=0,0,20,0&ch=5,/hu/systemic-risk/shocks" --watch-request "fragility"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "/systemic-risk/shocks?mode=fragile" --watch-request "fragility"
node scripts/layout-audit.mjs   # /systemic-risk/shocks (all three modes) at 360/768/1280/1536, light + dark
```
(Expect the watched worker request false on the first command's pages, true on the second.) Stop the server;
confirm port 4173 is free.

## Pitfalls
- **Recompute vs playback:** simulate once per setup change; playback only moves the cursor through stored days.
- **Same scenario for every rescue policy** (seeded); compare on identical shocks.
- **The drop list URL format** must be validated (four numbers in range); fall back to zeros.

## Findings (filled in 2026-10-28, session ea82)
- Rescue calibration: with the planned -20% MBS the scenario is flat (every policy leaves 4 defaults, the failed dealer plus three that no chunk saves), so the mortgage drop is **-30%** (`RESCUE_MBS_DROP`). Core-periphery seeds 1-8, defaults none/largest/debtRank/weakest: 14/11/10/11, 9/7/7/7, 22/8/8/8, 22/8/8/8, 8/6/6/6, 9/7/7/7, 7/7/7/7, 11/9/9/9. DebtRank is never worse than largest-first (tested, 8 seeds) but is strictly better on only some seeds (1 of 8 here); the rest tie because the top four of both rules overlap, so "DebtRank beats largest on most seeds" is NOT met, only "never worse". A brute force over the top-10 institutions (seeds 1 and 3) found DebtRank optimal on seed 1 (10) and one default short of optimal on seed 3 (8 vs 7), so beating or tying the benchmark is realistic.
- Sweep peak and copy: worker sweep reproduces plan 05's curve (peak at 3-4 links, tied degrees average to 3.5; tolerance 1.5). The worker starts when fragile mode mounts, so the reader's guess is hidden until the sweep (about 6 s) is done; the Reveal button stays disabled meanwhile and a progress line shows points computed. Copy: few links = shocks cannot travel, many = spread thin, between = cascades (explain question with three options).
- New HU keys for owner review: all `syrShock*` keys in `SystemicRiskShocks.hu.ts` are drafts (modes, setup, kind names `syrShockKind_*`/`syrShockShort_*`, channel names and help, event labels, outcome stats, two surprises, rescue, fragility, three About paragraphs). Kind names had to differ from EN, hence "Kereskedelmi bank" and "Központi szerződő fél". `sbxCh_syr-rescue` "Mentés korlátos keretből", `sbxCh_syr-fragile` "Robusztus, mégis sérülékeny".
- Deviations: no `asset` or `day` URL keys (`drop` carries all four price drops, the cursor is not written to the URL while playing). Rescue scenario MBS drop 30% instead of 20% (above). Losses chart shows cumulative per-channel lines instead of stacked areas (honest tooltips). Edges point borrower to lender (the way a loss travels). Institution display names live in this page's own `syrShockKind_*` keys (plan 06 may have its own; merge later if desired). The old `syrShockPlanned` text was replaced by a three-paragraph "How to read this simulation" panel (SEO word floor for sub-pages). Rescue removal is a minus button per placed chunk (no Shift-click). The drop-list URL in the plan's smoke command needs `%2C` instead of commas because `--paths` splits on commas. Registry `status` left unchanged: plans 06 and 08 were not done. `test:seo` was not run against a complete build (parallel builds break the SEO prerender step; client bundle was audited on the preview).
- Verification: tsc clean for my files (other errors belong to fama-french, systemic-risk/network, treasury-futures); eslint clean for my files (12 repo errors elsewhere); `test:systemic-risk` 56/56 (incl. 10 new in `scripts/systemic-shocks-page.test.mjs`), `test:challenges`, `test:sandbox` green. Smoke on preview: watched "fragility" request false on /shocks, ?mode=rescue, drop/ch URL, /hu; true on ?mode=fragile. Layout audit 360/768/1280/1536 light+dark: only tap-target warnings (shared SwitchRow buttons, network zoom buttons) and chart-internal label collisions of the node badges and the sample graph.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/07-shock-simulation.md`; confirm plans
> 04 and 05 are done and read their Findings. Implement plan 07: click-to-fail and drag-to-crash shock setup,
> channel switches, day-by-day network playback with an event timeline and pinned comparison charts, the
> rescue game (`syr-rescue`) and the worker-driven robust-yet-fragile sweep (`syr-fragile`), and tests. Run the
> verification block, fill in Findings, append DONE to LOG.md, set plan 07 to `done`, and summarise.
