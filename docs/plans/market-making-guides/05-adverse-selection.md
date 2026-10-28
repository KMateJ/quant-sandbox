# 05 — Lesson: Adverse selection and informed trading

Status: done (2026-10-28, plan-05) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Adverse selection is the reason a spread survives competition. This lesson makes it measurable (markouts) and shows, with one formula, how informed customers move the best spread outward and create a break-even spread below which every fill loses on average.

## Current state (verified 2026-10-28)
- After plan 01: lesson `adverse-selection` is registered in `src/features/guide/guide.meta.ts` (track `microstructure`,
  title key `guideMsAdverseSelectionTitle`, labs `["market-making"]`) with a placeholder
  text in `src/Language/guides/adverseSelection.ts` (export `adverseSelection`, already in `guides/index.ts`) and a placeholder
  figure `src/features/guide/components/figures/microstructure/ToxicIncomeFigure.tsx` registered as `"toxic-income"` in
  `figures/index.ts`. Its figure strings live in the `// #region adverse-selection` block of
  `src/Language/GuideMicrostructure.hu.ts` / `GuideMicrostructure.ts` (currently `gfMsToxicIncomeTitle` only).
  `scripts/guide-audit.test.mjs` lists `"adverse-selection"` on its own line in `PLACEHOLDER`; `docs/GUIDES_PLAN.md`
  has its row under "Market microstructure" with status `placeholder`.
- Registered titles you may cite (EN / HU, exact): "Market makers and liquidity" / „Market makerek és a likviditás”; "Queue position and fill probability" / „A sorban elfoglalt hely és a teljesülés valószínűsége”; "The limit order book" / „A limitáras ajánlati könyv”. Every lesson of the track
  has its final title from plan 01 on, so citing a lesson that is still a placeholder is fine.
- Exemplar lesson (checks + worked block shapes): `src/Language/guides/annuities.ts` (check
  `{ kind: "check", id, prompt, answer: { type: "number", value, tolerance } | { type: "choice", options, correct }, explain }`,
  worked `{ kind: "worked", title, steps: [{ text, tex, result: { value, tolerance } }] }`). Exemplar figure:
  `src/features/guide/components/figures/wave4/CltConvergenceFigure.tsx` (`GuideFigure title labId`,
  `SliderField`, `SegmentedControl`, `FigureReadout`, `fmt` from `figureFormat.ts`).
- Lab this lesson practises: `/market-making` (module `market-making`; built by `docs/plans/market-making` — link it,
  never edit its files).

## Goal
1. Replace the placeholder with the full lesson in EN and HU (EN 900–1800 words), meeting the README §4
   lesson standard.
2. A working interactive figure `"toxic-income"` with its maths in a pure file and a test.
3. Remove `"adverse-selection"` from `PLACEHOLDER`; set its GUIDES_PLAN row to `done`.

## Non-goals
- No edits to other lessons, shared guide files (beyond the three named lines/regions) or lab folders.

## Lesson outline (headings are plain noun phrases; adjust wording, keep the order and the substance)
Opening paragraph (no heading): what the lesson does, citing "Market makers and liquidity" and "Queue position and fill probability" by
exact title (HU: „Market makerek és a likviditás” és „A sorban elfoglalt hely és a teljesülés valószínűsége”).

1. Informed and uninformed customers — noise traders trade for their own reasons; informed traders trade because they expect the price to move; the maker cannot tell them apart.
2. Markouts — the side-signed mid move after a fill over a horizon `h`: `M_h = \text{sgn}\,(m_{t+h} - m_t)` from the maker's view; noise fills have mean markout zero, informed fills negative.
3. A model of the maker's income — symmetric half-spread `δ`; arrivals at rate `λ`, a share `π` informed; a noise customer accepts a price `δ` away from the mid with probability `e^{-kδ}`; an informed customer trades when the value move over `h`, `ΔV ∼ N(0, s^2)` with `s = σ\sqrt h`, exceeds `δ`.
4. Expected loss to one informed arrival — derive the normal partial expectation `E[(ΔV - δ)^+] = s\,φ(δ/s) - δ(1 - Φ(δ/s))` step by step; both sides ⇒ `2\,E[(ΔV-δ)^+]`.
5. Income rate — `R(δ) = λ[(1-π)\,δ e^{-kδ} - 2π\,(s φ(δ/s) - δ(1-Φ(δ/s)))]`; with `π = 0` the best half-spread is `1/k`; as `π` grows the maximum moves right and a break-even `δ_0` appears.
6. Toxic flow in practice — markout curves by counterparty, why venues and brokers segment flow, why makers pay for retail order flow.

Then: one `worked` block (below), the `figure("toxic-income")` right after the paragraph that says what to try in it,
two or three `check` blocks placed after the sections they test, `h("Summary")` + `list()` of 3–5 points,
`lab("/market-making", "<Open the … lab>")`. Also cite "The limit order book" where the text uses them (same citations in HU).

## Worked example
Parameters `λ = 4` arrivals/s, `k = 0.5` per ¢, `σ = 1` ¢/√s, `h = 3` s (so `s = 1.732`¢), `π = 0.2`. Steps: noise income per arrival at `δ = 2`¢ (`2e^{-1} = 0.7358`¢), informed loss per arrival at `δ = 2` (compute the partial expectation with node), net income rate `R(2)`, and the same at `δ = 3` to show the best spread moved out. Paste exact node outputs.
Compute every intermediate value with `node` and paste the results (tolerances as in the exemplar).

## Checks (ids fixed; wording yours)
- `adverse-selection/markout` (choice): a maker's buys have an average 10-second markout of −0.8¢. What does that mean? — after the maker buys, the mid tends to fall, so the sellers knew something (correct) / the maker earns 0.8¢ per share / the spread is 0.8¢ / the fills were too slow.
- `adverse-selection/no-informed` (number): with no informed traders and `k = 0.4` per ¢, which half-spread in ¢ maximises income? (2.5, tolerance 0.01).

## Figure
Interactive income curve. `LineChart` of `R(δ)` per minute against δ (0–8¢) for the current π, with the π = 0 curve dashed for reference (contrasting colour, not only dashes); markers at the best δ and the break-even δ; `SliderField`s for informed share (0–40%, default 20%) and volatility (default 1); a `DragHandles` x-handle on the chart to choose δ, with readouts noise income, informed loss, net income per minute at that δ.
All text through `t()` with keys inside the `// #region adverse-selection` block (HU file first, then EN); component
≤ ~80 lines (split helpers into `figures/microstructure/ToxicIncome*.tsx`), styles via existing
figure classes (`gf-toolbar`, `gf-placeholder` etc.) or a small block appended to `src/styles/guide.scss` only if
unavoidable (append at the end, prefixed `.gf-ms-adverse-selection`). Every number the text quotes from the default state
must match the figure's default output.

## Maths and tests
**Shared helper (create if missing):** `src/lib/market/informed.ts` with `///` docs: `informedLoss(delta: number, s: number): number` (= `s·normPdf(delta/s) − delta·(1 − normCdf(delta/s))`) and `incomeRate(delta: number, p: { lambda: number; k: number; informed: number; sigma: number; horizon: number }): number` as above, plus `bestDelta(p)` (golden-section on [0, 6/k]) and `breakEvenDelta(p)` (bisection with `src/lib/math/roots.ts` `bisection`). The labs pack's market making lab (its plan 05) imports the same file; if it already exists, import it and do not change signatures; if you create it, append a `CONTRACT` line to both `docs/plans/market-making-guides/LOG.md` and `docs/plans/market-making/LOG.md`. Figure-only helpers go in `src/features/guide/guide.micro.adverseSelection.math.ts`. Tests: `incomeRate` with π = 0 equals `expectedSpreadIncome(δ, λ/2, k)` from `src/lib/market/quotes.ts`; `bestDelta` = 1/k at π = 0 and increases with π; `informedLoss` against a Monte Carlo estimate (±2%).
Test file: `scripts/guide-micro-adverse-selection.test.mjs` (run by `npm run test:guide-micro`; import TS with
`scripts/lib/load-ts.mjs` `importSrc(...)` — relative imports only, `.ts` appended, no folder `index` imports).

## Steps
1. Re-read `docs/plans/market-making-guides/LOG.md`; claim the plan (Status line + `CLAIM` log line).
2. Write the maths file(s) and the test; make the test pass.
3. Build the figure; check it in the browser at the defaults; note the default readouts.
4. Write the EN lesson, then the HU lesson with the same blocks in the same order (§2 HU terms of the README).
5. Delete the `"adverse-selection"` line from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` (only that line); set the
   GUIDES_PLAN row (Owner `market-making-guides`, Status `done`); append one GUIDES_PLAN Log line.
6. Run the verification block; fill in Findings; append `DONE` to LOG.md; set the README row to `done`.

## Acceptance criteria
- `npm run test:guide-audit` passes with `"adverse-selection"` no longer in `PLACEHOLDER` (≥ 2 checks, worked, figure,
  word range, citations in both languages, opening cites a registered title).
- `npm run test:guide-micro`, `test:guide-checks`, `test:guide-graph`, `test:guide-markdown` pass.
- Smoke: no problems on the lesson in EN and HU; the figure responds to every control by pointer and keyboard.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language/guides/adverseSelection.ts src/Language/GuideMicrostructure.ts src/Language/GuideMicrostructure.hu.ts scripts/guide-micro-adverse-selection.test.mjs
npm run test:guide-micro && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --prefix /hu \
  --paths "/guide/microstructure,/guide/microstructure/adverse-selection,/hu/guide/microstructure/adverse-selection"
```
Stop the server; confirm port 4173 is free. If another session's half-done lesson makes the shared tree red,
verify in a temporary `git worktree add --detach` copy and say so in Findings.

## Pitfalls
- Citations must match the registered title character for character (en dash in "Glosten–Milgrom", "bid–ask").
- TeX: escape backslashes; no literal `$` for currency; `{,}` for HU decimal commas and EN thousands.
- Checks stay where they are written; the track page collects them. No inline quiz UI.
- Units: δ and σ in cents, λ per second; the chart shows per minute (`× 60`). Say so in the axis labels.

## Findings (fill in during execution)
- EN word count and figure default readouts quoted in the text: EN ≈ 1,610 words (HU ≈ 1,450). Defaults quoted and matched in the browser: noise 141.3, informed loss 10.2, net 131.0 ¢/min at δ = 2¢; best half-spread 2.29¢ (132.7¢/min); break-even 0.32¢; at 40% informed best 2.64¢ / break-even 0.74¢; at σ = 2, 20% informed best 2.85¢ and net 83.1¢/min at 2¢. Worked example (node): s = 1.7321, 2e^{-1} = 0.7358, L(2) = 0.1066, net per arrival 0.5460, R(2) = 2.1839 ¢/s (131.04¢/min), R(2.3) = 2.2116, π = 0 R(2) = 2.9430, difference 0.7591. Pinned by the last test in `scripts/guide-micro-adverse-selection.test.mjs`.
- HU text awaiting owner review (headings, terms used): whole lesson `src/Language/guides/adverseSelection.ts` (hu) and the `gfMsToxic*` figure strings. Headings: „Informált és nem informált ügyfelek”, „Markout”, „A market maker bevételének modellje”, „Egy informált ügyfélen várható veszteség”, „A bevételi ráta és a legjobb spread”, „Toxikus megbízásáramlás a gyakorlatban”. Terms: zajkereskedő / zajügyfél, informált, kedvezőtlen kiválasztás, fél spread, nullszaldós spread (break-even), „market maker (árjegyző)” on first mention, „a bid / az ask / az askon vesz”.
- Deviations: (1) The worked example compares δ = 2¢ with δ = 2.3¢, not 3¢: with these parameters R(3) < R(2) (the optimum is 2.29¢), so 3¢ would not show the best spread moving out. (2) The figure's volatility slider runs 0.25–2 (not unbounded): above that, with 40% informed, the best half-spread leaves the 0–8¢ chart. (3) Extra first-order condition derivation (L′ = −(1 − Φ)) added to explain why the best spread moves outward; a third check `adverse-selection/loss-at-zero` added (plan asks for 2–3). (4) `npm run build` not run: `tsc -b` is red from the market-making desk pack's half-done files (`mmd*` translation keys); my files typecheck clean and the lesson was checked on the dev server (EN desktop, HU mobile, keyboard handle) instead of `vite preview`/`cdp-smoke`. (5) Audit still fails only the pre-existing rule "labs no lesson practises: fama-french, systemic-risk" (another pack).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making-guides/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making-guides/05-adverse-selection.md`; confirm plan 01 is
> done (stop and report if not). Write the lesson "Adverse selection and informed trading" in EN and HU following the outline, the worked
> example and the checks in the plan; build the interactive figure `toxic-income` with its pure maths and
> `scripts/guide-micro-adverse-selection.test.mjs`; remove the id from `PLACEHOLDER` and mark its GUIDES_PLAN row done.
> Run the verification block, fill in Findings, append DONE to LOG.md, set plan 05 to `done` in the README
> table, and summarise.
