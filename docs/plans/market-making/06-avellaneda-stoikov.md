# 06 — Avellaneda–Stoikov lab: skew, drawn policy, tournament

Status: done (2026-10-28, opus-main) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: L

## Why
A market maker who is long wants to sell, so they shade both quotes down; how much depends on risk
aversion, volatility and time left. The reader should feel this by dragging an inventory puck and watching
the reservation price and quotes move, then **draw their own skew rule** and race it against the
Avellaneda–Stoikov (AS) quotes and a symmetric maker over 500 simulated days.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: stub `src/features/avellaneda-stoikov/AvellanedaStoikovView.tsx`, registry entry
  `avellaneda-stoikov` (`status: "planned"`), copy `src/Language/AvellanedaStoikov.ts`/`.hu.ts` (prefix
  `avs`), partial `src/styles/_avellaneda-stoikov.scss`.
- After plan 02, `src/lib/market/quotes.ts`: `asReservation(s, q, γ, σ, tLeft) = s − qγσ²·tLeft`,
  `asTotalSpread(γ, σ, k, tLeft) = γσ²·tLeft + (2/γ)·ln(1 + γ/k)`, `asQuotes({ s, q, gamma, sigma, k, tLeft })`,
  `fillIntensity(δ, A, k) = A·e^{−kδ}`. `src/lib/math/random.ts`: `makeRng`, `nextNormal`; `src/lib/game/seed.ts`:
  `subSeed`.
- `src/lib/math/interpolate.ts`: `linearInterp(xs, ys, x)`, `clamp`, `linspace`. `src/lib/stats/moments.ts`:
  `mean`, `stdDev`; `src/lib/stats/histogram.ts`: `binValues(values, domain, binCount)`.
- Charts: `SketchLayer` (`src/components/charts/SketchLayer.tsx`; props `frame`, `mode: "curve" | "line"`,
  `value: SketchPoint[]`, `onChange`, `onCommit?`, `xGrid?`, `smooth?`, `yRange?`, `ariaLabel`, `color?`),
  `smoothSamples`/`applyStroke` from `sketch.logic.ts`; see `src/features/capm/components/BetaTab.tsx` for a
  lab that uses it. `Histogram` (`bins`, `markers?`, `ariaLabel`, `color?`, `height?`), `ScatterChart`,
  `LineChart`.
- Worker pattern: `src/features/monte-carlo/useMonteCarloLab.ts` (first result computed synchronously for
  pre-render, later inputs debounced to `new Worker(new URL("./x.worker.ts", import.meta.url), { type:
  "module" })`, stale answers dropped by `requestId`) and `monteCarlo.worker.ts`.

## Goal
1. **Skew explorer:** drag an inventory puck (q from −10 to +10) and play a day clock; a price column shows
   mid, reservation price, bid and ask with the formula filled in live.
2. **Draw your policy:** sketch reservation offset vs inventory; choose a half-spread; see AS's rule as a
   ghost line.
3. **Tournament:** 500 seeded days for your policy, AS(γ) and symmetric, in a worker; P&L histograms,
   mean vs sd scatter with an AS γ-sweep frontier, certainty equivalents, one sample day replay.
4. Predict (`avs-reservation`) and Challenge (`avs-beat`).

## Non-goals
- No order book (AS uses Poisson fills). No changes to `src/lib/market` (add sim code in this folder).

## Constraints
- README §2/§4. Default parameters are the AS (2008) paper's: s₀ = 100, T = 1, σ = 2, dt = 0.005, γ = 0.1,
  k = 1.5, A = 140, unit order size.

## Steps
1. **Simulation** (`asSim.math.ts`): `type Policy = { kind: "as"; gamma: number } | { kind: "symmetric";
   halfSpread: number } | { kind: "drawn"; qs: number[]; offsets: number[]; halfSpread: number }`.
   `quotesFor(policy, s, q, t, p)` → `{ bid, ask }`: AS via `asQuotes`; symmetric = mid ± half of
   `asTotalSpread(γ, σ, k, 1 − t)` of the AS rule at the same γ (the paper's comparison) or the fixed
   `halfSpread`; drawn = `s + linearInterp(qs, offsets, q) ± halfSpread`. `simulateDay(policy, p, seed)`:
   per step, `s += σ√dt·z`; bid fills with probability `A·e^{−k(s − bid)}·dt` (cap at 1), ask likewise;
   track cash, q (clamp quoting: stop quoting the side that would push |q| over `qMax = 25`); return
   `{ pnl, finalQ, path?: { t, s, bid, ask, q }[] }` (`path` only when asked). The z and fill uniforms come
   from `makeRng(subSeed(seed, day))` drawn in a fixed order so every policy sees the same prices and
   uniforms. `runTournament(policies, p, seed, days = 500)` → per policy `{ pnl: number[], finalQ: number[],
   mean, sd, ce }` with `certaintyEquivalent(pnls, γ) = −(1/γ)·ln(mean(e^{−γ·x}))` (shift by the mean before
   exponentiating to avoid overflow). `frontier(p, seed, gammas = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1], days
   = 200)` → `{ gamma, mean, sd }[]`.
2. **Worker** (`avellanedaStoikov.worker.ts`, `useTournament.ts`): same pattern as `useMonteCarloLab`; the
   first (default) result may be computed synchronously **only for a 60-day preview** (keep first paint fast);
   the full 500-day run happens in the worker after "Run tournament" (button, not on every sketch stroke).
3. **Skew explorer** (`InventoryTrack.tsx`, `QuoteColumn.tsx`, `DayClock.tsx`, `AsFormula.tsx`): a
   horizontal track with a square puck (drag, ←/→ keys, ±1 share; shows "long 6" / "short 4"); a day clock
   (scrubber + play via `useTicker`, 0 → T); a vertical price column (SVG) with mid, reservation marker
   (`var(--primary)`), bid/ask lines and arrows from mid to reservation; the formula block with the live
   numbers (`r = 100 − 6·0.1·4·0.5 = 98.80`). γ, σ, k as secondary `SliderField`s.
4. **Policy sketch** (`PolicySketch.tsx`): chart x = q (−10…10), y = reservation offset ($, −2…2);
   `SketchLayer mode="curve"` with `xGrid` at integer q; AS's offset line at the current clock time as a
   dashed ghost; buttons "Copy AS", "Flat (symmetric)", "Clear"; half-spread `NumberStepper` (step 0.05). The
   drawn curve becomes `{ kind: "drawn", qs, offsets }`.
5. **Tournament results** (`TournamentResults.tsx`, `FrontierChart.tsx`, `SampleDay.tsx`): overlaid
   `Histogram`s of terminal P&L (yours, AS, symmetric; legend with words, distinct line styles); a scatter of
   (sd, mean) with the AS frontier line (γ labels) and three labelled dots; a table: mean, sd, CE at γ = 0.1,
   final inventory sd; a sample day (first seed) line chart of price with your quotes and an inventory strip.
6. **Predict** (`avs-reservation`, kind place): random q ∈ {−8…8}\{0} and t ∈ {0.25, 0.5, 0.75}; the reader
   drags a marker on the price column; `usePredictReveal({ truth: asReservation(...), tolerance: 0.15,
   resetKey: round, challengeId: "avs-reservation" })`, `PredictReveal input="plot"`. `PredictExplain`:
   "Near the close (t → T), a more risk-averse maker (higher γ) quotes …" options *wider* / *tighter*
   (correct: the inventory term vanishes and (2/γ)·ln(1 + γ/k) falls as γ rises) / *the same*. Second:
   "The symmetric maker earns more on average than AS. Why would anyone use AS?" (lower variance; the CE is
   higher).
7. **Challenge** (`avs-beat`, kind score): hit = your drawn policy's CE ≥ AS(0.1) CE − 1.0 on the same 500
   days (seed shown); `const CHALLENGE = "avs-beat"`, `recordChallenge(...)`, `ChallengeRecord`. "Copy AS"
   would hit trivially, so a challenge round requires a policy that differs from AS's offsets by ≥ 0.1 at
   some q (the rules text says so; the Run button explains when the sketch is too close to AS).
8. **View** (`AvellanedaStoikovView.tsx`): `PageHeader` actions = mode switch, `SeedControl compact`;
   `Tabs` (segmented) "Skew" / "Your policy" / "Tournament" inside the main `ChartContainer`; left `Panel` with
   parameters and formulas. Phone: one column.
9. **Wiring**: rows `avs-reservation` (place, "±$0.15") and `avs-beat` (score, "CE within $1 of AS");
   `sbxCh_avs-reservation` "Reservation price" / HU "Rezervációs ár", `sbxCh_avs-beat` "Beat the AS
   quotes" / HU "Győzd le az AS-jegyzést"; registry `status: "beta"`.
10. **Tests** `scripts/micro-avellaneda.test.mjs`: determinism and common random numbers across policies;
    reservation sign/size; drawn policy equal to AS offsets reproduces AS P&L exactly on the same seed;
    500-day AS(γ = 0.1) mean and sd close to the paper's Table 1 (inventory strategy ≈ 63 ± 6 profit, sd ≈ 6;
    symmetric ≈ 67, sd ≈ 13; accept ±20% and record your numbers; these reference values are from memory of
    the paper, so if you are outside the band, re-check the fill rule and units first, never tune parameters
    to match, and report the gap in Findings); CE ≤ mean; frontier sd decreases as γ
    rises; 500 days run < 1.5 s in Node.

## Acceptance criteria
- Dragging the puck or playing the clock moves the quotes smoothly with the live formula; the sketch is
  editable by pointer and resettable; the tournament runs off the main thread with a pending state.
- The numbers match the paper within the stated tolerance; the surprise question is answered by the lab.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/avellaneda-stoikov,/avellaneda-stoikov?mode=predict,/hu/avellaneda-stoikov" --watch-request "avellanedaStoikov\.worker"
node scripts/layout-audit.mjs   # /avellaneda-stoikov at 360/768/1280/1536
```
(`--watch-request` should be false on first load: the worker starts only when a tournament runs or after
first paint.) Stop the server; confirm port 4173 is free.

## Pitfalls
- **Common random numbers:** all policies must see the same price path and the same fill uniforms, or the
  comparison is noise. Draw both per step in a fixed order.
- **Fill probability > 1** for tight quotes at dt = 0.005 (A·dt = 0.7): cap at 1 and note it.
- **CE overflow:** subtract the mean before `exp`.
- **Pre-render:** the worker cannot run during SSR; the synchronous preview must be small.

## Findings (fill in during execution)
- Tournament numbers vs the paper (seed 1, 500 days, γ = 0.1): AS mean 64.97 (paper 62.94), sd 6.48 (5.89), final-q sd 2.85 (2.80); symmetric mean 68.27 (67.21), sd 12.19 (13.43), final-q sd 7.73 (8.66). All inside ±20%; no tuning. 500 days ≈ 30 ms per policy in Node.
- Challenge rule after the "Copy AS" check: CE ≥ AS CE − $1 with the drawn curve ≥ $0.10 from AS's at some q (Run disabled otherwise). Seed 1: symmetric misses (CE 58.52 vs 62.93); 1.3× AS misses (61.90); 0.7× AS hits and beats AS (63.89), a real surprise worth finding: AS's rule is optimal only under its own utility/limit assumptions.
- New HU keys for owner review: all `avs*` keys in `src/Language/AvellanedaStoikov.hu.ts`; `sbxCh_avs-reservation`, `sbxCh_avs-beat`.
- Deviations:
  - The drawn policy is a skew curve at the open that fades linearly to 0 at the close (like AS's (T − t) factor), with a constant half-spread. So "drawn = AS reproduces AS P&L exactly" is impossible (AS's half-spread varies with t); the test instead checks that a drawn curve equal to AS's offsets gives AS's quote centre at every (q, t).
  - "Clear" is the "Flat (symmetric)" button; an extra "AS half-spread" button sets the stepper to AS's mean half-spread.
  - P&L histograms are three small multiples on a shared axis instead of one overlaid chart (Histogram takes one series).
  - The tournament keeps the 60-day synchronous preview until "Run tournament"; changed inputs mark it stale rather than re-running on every stroke.
  - Header actions are wrapped in `.avs-actions` with a scoped `:has()` rule (same fix as the order book) so the long title does not overlap at 768px.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/06-avellaneda-stoikov.md`; confirm plans 01 and
> 02 are done. Implement plan 06: the inventory puck and day clock skew explorer, the drawn-policy sketch,
> the 500-day worker tournament with frontier and certainty equivalents, `avs-reservation` and `avs-beat`,
> and tests checked against the AS paper. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 06 to `done`, and summarise.
