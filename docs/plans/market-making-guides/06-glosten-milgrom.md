# 06 — Lesson: The Glosten–Milgrom model

Status: done (2026-10-28, plan-06 session) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Glosten–Milgrom turns adverse selection into a clean model: quotes are conditional expectations, the spread follows from Bayes' rule alone, and prices learn the truth trade by trade. It is the cleanest place to see a martingale price in action.

## Current state (verified 2026-10-28)
- After plan 01: lesson `glosten-milgrom` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsGlostenMilgromTitle`, labs `["glosten-milgrom"]`) with a placeholder
  text in `src/Language/guides/glostenMilgrom.ts` (export `glostenMilgrom`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/GmLearningFigure.tsx` registered as `"gm-learning"` in
  `figures/index.ts`. Its figure strings live in the `// #region glosten-milgrom` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsGmLearningTitle` only).
  `scripts/guide-audit.test.mjs` lists `"glosten-milgrom"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Adverse selection and informed trading" / „Kedvezőtlen kiválasztás és informált kereskedés”; "Conditional expectation and martingales" / „Feltételes várható érték és martingálok”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/glosten-milgrom` (module `glosten-milgrom`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"gm-learning"` with its maths in a pure file and a test.
3. Remove `"glosten-milgrom"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Adverse selection and informed trading" and "Conditional expectation and martingales" by
exact title (HU: „Kedvezőtlen kiválasztás és informált kereskedés” és „Feltételes várható érték és martingálok”).

1. Set-up — value `V ∈ \{0, 1\}` (or `V_L, V_H`), prior `μ = P(V = 1)`; each trader is informed with probability `π` and trades toward `V`, otherwise buys or sells with probability ½; competitive, risk-neutral maker earns zero expected profit per trade.
2. Quotes as conditional expectations — `a = E[V \mid \text{buy}]`, `b = E[V \mid \text{sell}]`; derive `P(\text{buy} \mid V=1) = π + (1-π)/2`, `P(\text{buy} \mid V=0) = (1-π)/2`, then Bayes: `a = μ(1+π) / (μ(1+π) + (1-μ)(1-π))` and the bid likewise.
3. The spread — at `μ = ½`: `a - b = π` (derive); zero when nobody is informed; grows with π.
4. Learning — after a buy the belief becomes `a`, after a sell `b`; beliefs are a martingale under the maker's information (show `P(\text{buy}) a + P(\text{sell}) b = μ`), and converge to the true value.
5. How fast — expected log-likelihood gain per trade `π \ln((1+π)/(1-π)) ≈ 2π^2`; doubling π makes learning about four times faster.
6. What the model leaves out — inventory, order size, strategic informed traders (next: Kyle).

Then: one `worked` block (below), the `figure("gm-learning")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/glosten-milgrom", "<Open the … lab>")`. 

## Worked example
π = 0.2, μ₀ = 0.5. Steps: P(buy | V=1) = 0.6, P(buy | V=0) = 0.4; ask = 0.6, bid = 0.4, spread 0.2; a buy arrives ⇒ μ₁ = 0.6; new ask = 0.36/0.52 = 0.6923, new bid = 0.24/0.48 = 0.5; check the martingale property at μ = 0.6 (P(buy) = 0.52: 0.52·0.6923 + 0.48·0.5 = 0.6).
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `glosten-milgrom/no-informed` (choice): set π = 0. What is the spread? — zero (correct) / unchanged / it doubles / it depends on the prior.
- `glosten-milgrom/ask` (number): π = 0.5, μ = 0.5 → ask (`0.5·0.75/(0.5·0.75 + 0.5·0.25) = 0.75`, tolerance 0.001).

## Figure
Interactive learning chart. Ask, bid and belief after each of 40 seeded trades (`LineChart`, ask `var(--negative)`, bid `var(--positive)`, belief dashed with contrasting colour), a strip of B/S tiles under the chart where **clicking a tile flips it** and everything after recomputes; `SliderField` π (0–60%, default 20%), true value `SegmentedControl` 0/1 (default 1), New sequence; readouts: belief now, spread now, trades to 90% confidence.
All text through `t()` with keys inside the `// #region glosten-milgrom` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/GmLearning*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-glosten-milgrom`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Import the labs pack's pure maths from `src/features/glosten-milgrom/glostenMilgrom.math.ts` (`pBuy`, `askAt`, `bidAt`, `update`, `gmPath`, `drawTrades`, `tradesToConfidence`, `infoPerTrade`; read the file first — the labs session noted `tradesToConfidence` takes `trueV`). Do not edit that file; if something is missing, write it in `src/features/guide/guide.micro.glostenMilgrom.math.ts`. Tests: the worked example numbers; `a − b = π` at μ = ½; flipping tile k changes only steps ≥ k.
Test file: `scripts/guide-micro-glosten-milgrom.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"glosten-milgrom"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"glosten-milgrom"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/glostenMilgrom.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-glosten-milgrom.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/glosten-milgrom,/hu/guide/microstructure/glosten-milgrom"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- If `src/features/glosten-milgrom/glostenMilgrom.math.ts` does not exist yet (labs-pack plan 07 not done), stop and append `BLOCKED` to LOG.md instead of copying its maths.

## Findings
- EN word count and figure default readouts quoted in the text: about 1,200 words of prose (p + list, formulas collapsed), 41 blocks in both languages, 3 checks (`ask`, `no-informed`, `learning-speed`), 1 worked block (9 steps), no notes. Figure defaults (π = 20%, V = 1, seed 7, 40 trades, prior ½): belief now 0.692, spread now 0.171, 90% confidence after 30 trades (belief then falls back to 0.692); at π = 50% the 90% mark is reached after 4 trades and the opening spread is 0.5; at π = 0% the three lines sit on 0.5. All are asserted in `scripts/guide-micro-glosten-milgrom.test.mjs` or checked in the browser. The worked example (0.6, 0.4, 0.6, 0.4, spread 0.2, 0.52, 0.6923, 0.5, 0.6) is asserted in the same test.
- HU text awaiting owner review: the whole lesson (`src/Language/guides/glostenMilgrom.ts`, `hu` block) and the figure strings in the `// #region glosten-milgrom` of `GuideMicrostructure.hu.ts`. Headings: „A modell felépítése”, „A jegyzések mint feltételes várható értékek”, „A spread”, „Tanulás a kötésekből”, „Egy negyvenkötéses példa”, „A tanulás sebessége”, „Amit a modell kihagy”, „Összefoglalás”. Terms: market maker (árjegyző) on first mention then „market maker” with a hyphenated suffix („market maker-t”, „market maker-rel”); hiedelem (belief), előzetes hiedelem (prior), esély (odds), valószínűségi hányados (likelihood ratio), log-esély, zajkereskedő, informált kereskedő, kötés, vétel/eladás; bid and ask stay English.
- Deviations: (1) The lesson has a third check, `glosten-milgrom/learning-speed` (π 0.1 → 0.3, about 9 times faster), beyond the two fixed ids. (2) The tile strip needed a small block at the end of `src/styles/guide.scss` (`// #region gf-ms-glosten-milgrom`, prefixed `.gf-ms-glosten-milgrom-*`), as the plan allows; `@include phone` is not available in that file, so it uses a plain `@media (max-width: 640px)`. (3) The lab maths already had everything needed (`flipTrade` too), so the figure file `src/features/guide/guide.micro.glostenMilgrom.math.ts` only composes it; it adds the seeded 40-trade sequence with toggled flips. (4) Changing π redraws the seeded sequence (informed traders are decided per trade by `rng() < π`), so it is the same coin flips with a growing informed set; flips are kept, "New sequence" clears them. (5) The 90% readout is "first time reached", which is why the default shows 30 although the final belief is 0.692.
- Verification: `npx tsc -b` clean; eslint (guide folders, my lesson, both GuideMicrostructure files, my test) clean; `test:guide-micro` 45/45, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` green. `test:guide-audit` 12/13: the only failure is "labs no lesson practises: fama-french, systemic-risk", which is pre-existing and belongs to the factor-and-systemic-risk pack (not touched). `npm run build` passes. The shared `dist/` was rebuilt by other sessions during the smoke run (404 on asset hashes), so the smoke ran on a private build (`vite build --outDir <scratch>`; its SEO plugin hook errored on the foreign outDir, the bundle was complete) on port 4186: `/guide/microstructure`, `/guide/microstructure/glosten-milgrom` and `/hu/...` all `problems: []`, h1 present, no `leakingLinks`. In the browser pane the figure responds to the tiles (click flips; flipping tile 1 gives belief 0.500, spread 0.200, "not reached"; flipping back restores 0.692 / 0.171 / 30), the V = 0/1 toggle (V = 0: belief 0.001, 90% after 12) and the π slider. Server stopped, port 4186 free. Not checked: phone width and keyboard-only slider drag (the slider and tiles use the repo's standard controls; tiles are buttons with ←/→ focus movement).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/06-glosten-milgrom.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "The Glosten–Milgrom model" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `gm-learning` with its pure maths and
> `scripts/guide-micro-glosten-milgrom.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 06 to `done` in the README
> table, and summarise.
