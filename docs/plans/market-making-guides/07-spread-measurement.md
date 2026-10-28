# 07 — Lesson: Measuring and decomposing the bid–ask spread

Status: done (2026-10-28, opus-spe) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Researchers and regulators usually see only trade prices. This lesson shows how much of the spread you can recover from them, why the estimate is biased when trading is informed, and how the spread splits into what it pays for.

## Current state (verified 2026-10-28)
- After plan 01: lesson `spread-measurement` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsSpreadMeasurementTitle`, labs `["spread-estimation"]`) with a placeholder
  text in `src/Language/guides/spreadMeasurement.ts` (export `spreadMeasurement`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/RollBounceFigure.tsx` registered as `"roll-bounce"` in
  `figures/index.ts`. Its figure strings live in the `// #region spread-measurement` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsRollBounceTitle` only).
  `scripts/guide-audit.test.mjs` lists `"spread-measurement"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "The limit order book" / „A limitáras ajánlati könyv”; "The Glosten–Milgrom model" / „A Glosten–Milgrom-modell”; "The law of large numbers and the central limit theorem" / „A nagy számok törvénye és a centrális határeloszlás-tétel”; "Returns and volatility" / „Hozamok és volatilitás”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/spread-estimation` (module `spread-estimation`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"roll-bounce"` with its maths in a pure file and a test.
3. Remove `"spread-measurement"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "The limit order book" and "The Glosten–Milgrom model" by
exact title (HU: „A limitáras ajánlati könyv” és „A Glosten–Milgrom-modell”).

1. Three spreads — quoted `a - b`; effective `2|p - m|` for one trade; realised `2Q_t(p_t - m_{t+h})` (the part of the spread the maker keeps once the price has moved for a horizon `h`); define each with the trade direction `Q_t = ±1` (buyer-initiated = +1).
2. Bid–ask bounce — with an efficient price `m_t` random walk and trades at `m_{t-1} + (S/2)Q_t`, consecutive price changes are negatively correlated.
3. The Roll estimator — derive `\text{cov}(Δp_t, Δp_{t-1}) = -S^2/4` with independent `Q`, so `S = 2\sqrt{-\text{cov}}`; what happens when the sample covariance is positive.
4. Informed trading biases Roll — with `m_t = m_{t-1} + α(S/2)Q_t + ε_t`, derive `\text{cov} = -(1-α)S^2/4`, so Roll converges to `S\sqrt{1-α}`; the effective spread still equals `S`.
5. Decomposition — the two-way Huang–Stoll regression `Δp_t = β_1 ΔQ_t + β_2 Q_{t-1} + e_t` gives `β_1 = S/2`, `β_2 = αS/2`; adverse-selection share `α = β_2/β_1`; the rest is order processing and inventory (this model does not separate those two; say so).
6. Sample size — estimates from 120 trades are noisy; the law of large numbers and the CLT tell how many trades a stable estimate needs.

Then: one `worked` block (below), the `figure("roll-bounce")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/spread-estimation", "<Open the … lab>")`. Also cite "The law of large numbers and the central limit theorem", "Returns and volatility" where the text uses them (same citations in HU).

## Worked example
Price changes with sample covariance −0.0004 (USD²) ⇒ Roll spread `2\sqrt{0.0004} = 0.04` USD. Then a market with true `S = 10`¢ and `α = 0.35`: Roll's limit `10\sqrt{0.65} = 8.06`¢ while the effective spread is 10¢; the gap is the informed share at work.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `spread-measurement/roll` (number): covariance of successive price changes −0.0009 → Roll spread (0.06, tolerance 0.0005).
- `spread-measurement/informed-bias` (choice): traders become more informed (α rises). Roll's estimate… — falls below the true spread (correct) / rises above it / stays unbiased / becomes negative.

## Figure
Interactive bounce. A tape of 120 seeded trades (`LineChart` of trade prices with the hidden efficient price toggled by a "Show efficient price" control, trades coloured by side only after the toggle), a scatter of Δpₜ against Δpₜ₋₁ (`ScatterChart`) with the OLS line, `SliderField`s true spread S (default 10¢), informed share α (default 0.35), efficient-price volatility (default 2.5¢), and sample size `SegmentedControl` 120 / 1,000 / 10,000; readouts: Roll estimate, effective spread, Huang–Stoll α̂, error vs true S.
All text through `t()` with keys inside the `// #region spread-measurement` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/RollBounce*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-spread-measurement`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Import `src/features/spread-estimation/spreadEstimation.math.ts` (`simulateTape`, `rollEstimate`, `effectiveSpread`, `huangStoll`, `convergence`; prices in cents with m₀ = 10000 per the labs session; read the file first). Do not edit it; figure helpers go in `src/features/guide/guide.micro.spreadMeasurement.math.ts`. Tests: worked example; on 50,000 trades Roll ≈ S√(1 − α) (±3%), effective = S.
Test file: `scripts/guide-micro-spread-measurement.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"spread-measurement"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"spread-measurement"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/spreadMeasurement.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-spread-measurement.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/spread-measurement,/hu/guide/microstructure/spread-measurement"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- If `src/features/spread-estimation/spreadEstimation.math.ts` does not exist yet, stop and append `BLOCKED` to LOG.md.
- Realised spread needs a horizon; define it once and use the same horizon in text and figure, or leave the realised spread as a definition without a number.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: EN 1,373 words, 47 blocks (EN/HU identical
  kinds and order). Figure seed 7; defaults S 10¢, α 0.35, σ 2.5¢, 120 trades → Roll 9.66¢, limit 8.06¢,
  effective 10.00¢, Huang–Stoll α̂ 27.9%, error −3.4%; at 10,000 trades Roll 8.28¢ (−17.2%), α̂ 34.6%
  (checked in the browser against the text).
- HU text awaiting owner review (headings, terms used): all of `hu` in `src/Language/guides/spreadMeasurement.ts`
  (headings „Háromféle spread”, „Bid–ask pattogás”, „A Roll-becslés”, „Az informált kereskedés torzítja a
  Roll-becslést”, „A spread felbontása”, „Mintanagyság”; terms: kötés, hatékony ár, effektív / realizált /
  jegyzett spread, kedvezőtlen kiválasztás, árhatás, készlet, market maker (árjegyző)) and the `gfMsRb*` keys
  in `GuideMicrostructure.hu.ts`.
- Deviations: none in content. The realised spread is defined without a number (pitfall option). Figure helper
  `guide.micro.spreadMeasurement.math.ts` imports the lab's `spreadEstimation.math.ts` unchanged. Verified:
  guide-micro 74/74, guide-checks/graph/markdown green; guide-audit's only failure is the pre-existing
  fama-french/systemic-risk "lab without a lesson" (other pack); tsc red only in inventory-skew / pnl figures
  (plans 10/12 in flight); dev-server smoke EN/HU with no problems from this lesson (a transient main.scss
  500 came from another session's mid-edit; sass compiles). Full build/preview smoke not run (tree red).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/07-spread-measurement.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Measuring and decomposing the bid–ask spread" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `roll-bounce` with its pure maths and
> `scripts/guide-micro-spread-measurement.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 07 to `done` in the README
> table, and summarise.
