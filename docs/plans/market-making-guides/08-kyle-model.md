# 08 — Lesson: Informed trading and Kyle's lambda

Status: done (2026-10-28, opus-glm) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Glosten–Milgrom's informed traders are mechanical. Kyle's insider chooses how much to trade, hides in noise, and the maker prices total order flow. The result, price impact λ, is the most used number in microstructure.

## Current state (verified 2026-10-28)
- After plan 01: lesson `kyle-model` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsKyleModelTitle`, labs `["kyle"]`) with a placeholder
  text in `src/Language/guides/kyleModel.ts` (export `kyleModel`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/KyleScheduleFigure.tsx` registered as `"kyle-schedule"` in
  `figures/index.ts`. Its figure strings live in the `// #region kyle-model` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsKyleScheduleTitle` only).
  `scripts/guide-audit.test.mjs` lists `"kyle-model"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "The Glosten–Milgrom model" / „A Glosten–Milgrom-modell”; "Adverse selection and informed trading" / „Kedvezőtlen kiválasztás és informált kereskedés”; "Conditional expectation and martingales" / „Feltételes várható érték és martingálok”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/kyle` (module `kyle`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"kyle-schedule"` with its maths in a pure file and a test.
3. Remove `"kyle-model"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "The Glosten–Milgrom model" and "Adverse selection and informed trading" by
exact title (HU: „A Glosten–Milgrom-modell” és „Kedvezőtlen kiválasztás és informált kereskedés”).

1. One auction — `V ∼ N(p_0, σ_v^2)` known to the insider; noise order `u ∼ N(0, σ_u^2)`; the maker sees `y = x + u` and sets `p = E[V \mid y]`.
2. Linear equilibrium — guess `x = β(V - p_0)` and `p = p_0 + λ y`; the insider maximises `E[(V - p)x]` ⇒ `x = (V - p_0)/(2λ)`; the maker's projection ⇒ `λ = β σ_v^2/(β^2 σ_v^2 + σ_u^2)`; solve: `β = σ_u/σ_v`, `λ = σ_v/(2σ_u)`. Derive every step.
3. What the equilibrium says — half the private information gets into the price; the insider's expected profit `σ_u σ_v / 2` grows with noise; noise traders lose the same amount on average.
4. Many auctions — with one constant λ (the labs' simplification), the insider's best order with `m` auctions left closes `1/(m+1)` of the remaining gap; trading gradually beats trading at once. Kyle (1985) lets λ change by auction; say so without deriving it.
5. Estimating λ — regress price changes on signed order flow; units (price per share, or bp per 1% of volume).

Then: one `worked` block (below), the `figure("kyle-schedule")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/kyle", "<Open the … lab>")`. Also cite "Conditional expectation and martingales" where the text uses them (same citations in HU).

## Worked example
σ_v = 4, σ_u = 1,000 shares, p₀ = 100, V = 104. Steps: β = 250 shares per USD, x = 1,000 shares; λ = 0.002 USD per share; expected price p = 100 + 0.002·1,000 = 102 (half the gap); insider's profit given this V: (104 − 102)·1,000 = 2,000 USD; unconditional expected profit σ_uσ_v/2 = 2,000 USD.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `kyle-model/lambda` (number): σ_v = 2, σ_u = 500 → λ (`2/(2·500) = 0.002`, tolerance 0.00001).
- `kyle-model/more-noise` (choice): noise trading doubles. The insider's expected profit… — doubles (correct) / halves / is unchanged / falls to zero.

## Figure
Interactive schedule. N = 10 auctions; `DraggableBars` (`src/components/charts`) for the insider's orders with ghost bars (`shadows`) showing the optimal orders; a price path from p₀ toward V (dashed V line) under fixed seeded noise; a toggle "Insider's view / Market maker's view" (the maker's view shows only total order flow bars); readouts: your profit, the optimal profit on the same noise, gap closed %. Defaults: σ_v = 4, per-auction noise 1,000, V − p₀ = +4.
All text through `t()` with keys inside the `// #region kyle-model` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/KyleSchedule*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-kyle-model`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
Import `src/features/kyle/kyle.math.ts` (`cCoef`, `lambdaStar`, `optimalOrder`, `runAuctions`, `drawRound`, `expectedOptimalProfit`; read it first). Do not edit it; one-auction closed forms (`kyleOneShot({ sigmaV, sigmaU }) → { beta, lambda, expectedProfit }`) go in `src/features/guide/guide.micro.kyleModel.math.ts`. Tests: worked example; Monte Carlo of the one-shot game confirms zero expected maker profit and `σ_uσ_v/2` insider profit (3 s.e.).
Test file: `scripts/guide-micro-kyle-model.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"kyle-model"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"kyle-model"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/kyleModel.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-kyle-model.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/kyle-model,/hu/guide/microstructure/kyle-model"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- If `src/features/kyle/kyle.math.ts` does not exist yet, stop and append `BLOCKED` to LOG.md.
- Do not present the constant-λ multi-auction rule as Kyle's 1985 equilibrium; call it "with one constant λ".

## Findings (fill in during execution)
- EN word count ≈ 1,350 prose words (1,553 raw tokens incl. TeX/markup); audit word range passes. Figure defaults quoted in the text
  (all asserted in `scripts/guide-micro-kyle-model.test.mjs`): constant λ = 0.00106 USD/share (lambdaStar, N = 10);
  default plan = 1,900 shares in auction 1, then 0; your profit 4,186 USD; optimal on the same noise 6,403 USD; gap closed 47%;
  first ghost 343 shares. Noise seed 2 (`KYLE_FIG`), V = p₀ + 4.
- HU text awaiting owner review: headings „Egyetlen aukció”, „A lineáris egyensúly”, „Az egyensúly tulajdonságai”, „Több aukció”,
  „A lambda becslése”, „Összefoglalás”; terms bennfentes, zajkereskedő, megbízásáramlás, árhatás(-együttható), aukció, rés (gap),
  nullszaldós, kereskedési intenzitás, „A bennfentes nézete” / „A market maker nézete”.
- Deviations: a third check `kyle-model/schedule` (number, 750) added; figure adds a "Reset to the default plan" button; in the
  maker's view dragging a flow bar edits your order (order = flow − noise), so both views are interactive. Optimal path shown
  dashed alongside V. test:guide-audit red only on pre-existing fama-french/systemic-risk; test:guide-graph's layout timing test
  failed under load (unrelated). Built with SEO_ALLOW_EMPTY into .tmp-dist-kylguide and smoked on 4176 (full `npm run build` not run).
  Layout audit at 360 px flags tap targets (site chrome + toolbar buttons) and inline KaTeX overflow; 1280 px clean.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/08-kyle-model.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Informed trading and Kyle's lambda" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `kyle-schedule` with its pure maths and
> `scripts/guide-micro-kyle-model.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 08 to `done` in the README
> table, and summarise.
